var JapanPortfolio = (function() {

  var $portfolio;
  var isPortfolioActive = false;

  function init() {

    if (isActive()) {
      $('#tab_portfolio').removeClass('invisible');
    }

    var $container = $('#tab_portfolio-content');
    $portfolio = $portfolio || $('#portfolio');

    if ($portfolio &&
      (!$('#portfolio').parent().length ||
        $('#portfolio').parent().get(0).id !== 'tab_portfolio-content')) {
      $portfolio.detach();
      $container.append($portfolio);
    }
  }

  function show() {
    if (JPTradePage.isJapan() && !isPortfolioActive) {
      PortfolioWS.onLoad();
      isPortfolioActive = true;
    }

    return;
  }

  function isActive() {
    if (page.client.is_logged_in && JPTradePage.isJapan()) {
      return true;
    }
  }

  function hide() {
    if (JPTradePage.isJapan() && isPortfolioActive) {
      PortfolioWS.onUnload();
      isPortfolioActive = false;
    }

    return;
  }

  return {
    init: init,
    show: show,
    hide: hide,
    isActive: isActive,
  };
})();

module.exports = {
    JapanPortfolio: JapanPortfolio,
};
