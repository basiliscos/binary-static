var StatementUI = (function(){
    "use strict";
    var tableID = "statement-table";
    var columns = ["date", "ref", "payout", "act", "desc", "credit", "bal", "details"];
    var allData = [];
    var oauth_apps = {};

    function createEmptyStatementTable(){
        var header = [
            Content.localize().textDate,
            Content.localize().textRef,
            page.text.localize('Potential Payout'),
            Content.localize().textAction,
            Content.localize().textDescription,
            Content.localize().textCreditDebit,
            Content.localize().textBalance,
            Content.localize().textDetails
        ];

        var jpClient = japanese_client();

        header[6] = header[6] + (jpClient ? "" : (TUser.get().currency ? " (" + TUser.get().currency + ")" : ""));

        var metadata = {
            id: tableID,
            cols: columns
        };
        var data = [];
        var $tableContainer = Table.createFlexTable(data, metadata, header);
        return $tableContainer;
    }

    function updateStatementTable(transactions){
        Table.appendTableBody(tableID, transactions, createStatementRow);
    }

    function clearTableContent(){
        Table.clearTableBody(tableID);
        allData = [];
        $("#" + tableID +">tfoot").hide();
    }

    function createStatementRow(transaction){
        var statement_data = Statement.getStatementData(transaction, TUser.get().currency, japanese_client());
        allData.push($.extend({}, statement_data, {action: page.text.localize(statement_data.action)}));
        var creditDebitType = (parseFloat(statement_data.amount) >= 0) ? "profit" : "loss";

        var $statementRow = Table.createFlexTableRow([
                statement_data.date,
                '<span' + showTooltip(statement_data.app_id, oauth_apps[statement_data.app_id]) + '>' + statement_data.ref + '</span>',
                statement_data.payout,
                page.text.localize(statement_data.action),
                '',
                statement_data.amount,
                statement_data.balance,
                ''
            ], columns, "data");

        $statementRow.children(".credit").addClass(creditDebitType);
        $statementRow.children(".date").addClass("pre");
        $statementRow.children(".desc").html(page.text.localize(statement_data.desc) + "<br>");

        //create view button and append
        if (statement_data.action === "Sell" || statement_data.action === "Buy") {
            var $viewButtonSpan = Button.createBinaryStyledButton();
            var $viewButton = $viewButtonSpan.children(".button").first();
            $viewButton.text(page.text.localize("View"));
            $viewButton.addClass("open_contract_detailsws");
            $viewButton.attr("contract_id", statement_data.id);

            $statementRow.children(".desc,.details").append($viewButtonSpan);
        }

        return $statementRow[0];        //return DOM instead of jquery object
    }

    function errorMessage(msg) {
        var $err = $('#statement-ws-container #err-msg');
        if(msg) {
            $err.removeClass('invisible').text(msg);
        } else {
            $err.addClass('invisible').text('');
        }
    }

    function exportCSV() {
        downloadCSV(
            Statement.generateCSV(allData),
            'Statement_' + page.client.loginid + '_latest' + $('#rows_count').text() + '_' +
                toJapanTimeIfNeeded(window.time).replace(/\s/g, '_').replace(/:/g, '') + '.csv'
        );
    }

    return {
        clearTableContent: clearTableContent,
        createEmptyStatementTable: createEmptyStatementTable,
        updateStatementTable: updateStatementTable,
        errorMessage: errorMessage,
        exportCSV: exportCSV,
        setOauthApps: function(values) {
            return (oauth_apps = values);
        }
    };
}());

module.exports = {
    StatementUI: StatementUI,
};
