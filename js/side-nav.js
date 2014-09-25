// ======================================================================
// Feature Dection

var FeatureDetection = (function() {
  var results = {};
  var prefixes = ['', 'Webkit', 'Moz', 'O', 'ms', 'Khtml'];

  // Detect the android native browser
  var nua = navigator.userAgent;
  var is_android_native = (
    nua.indexOf('Mozilla/5.0') > -1 &&
    nua.indexOf('Android ') > -1 &&
    nua.indexOf('AppleWebKit') > -1 &&
    nua.indexOf('Chrome') === -1 );
    
  var is_icecream_sandwich = (
    nua.indexOf('Android 2') > -1 &&
    nua.indexOf('Chrome') === -1 );
  
  // Test for e.g. 'background-clip: text;' support.
  results['background-clip'] = checkForProperty('backgroundClip') && !is_android_native;

  // Test if device supports touch events
  results['touch'] = ('ontouchstart' in document);

  // Test if HTML5 history is enabled
  results['history'] = (window.history && window.history.pushState && !is_icecream_sandwich) ? true : false;

  // Apply classes to <html>
  var htmlElem = $('html');

  for (var key in results) {
    results['no-' + key] = !results[key];
  }

  for (key in results) {
    if (results[key] === true) {
      htmlElem.addClass(key);
    }
  }

  function checkForProperty(propName) {
    var div = document.createElement('div');
    if (propName in div.style) { return true; }

    var capitalized = propName.replace(/^([a-z])/, function(s) { return s.toUpperCase(); });
    for (var n = 0; n < prefixes.length; n++) {
      if ((prefixes[n] + capitalized) in div.style) { return true; }
    }

    return false;
  }

  return results;
})();




// ======================================================================
// Side navigation menu, Top (mobile) navigation menu 

var SideNav = (function() {
  var sideNav = $('.side-nav');
  var topNav = $('.top-nav');
  var navItems = $("li a", sideNav);
  var collapsableNav = (
    FeatureDetection['history'] &&
    !FeatureDetection['touch'] );

  init();
  function init() {
            
    if (!collapsableNav) {
      $('html').addClass('side-nav-always-open');
    }
    else {
      // wait till page has loaded, and then some
      $(function() { setTimeout(collapse, 1200); });
      
      sideNav
        .mouseenter(expand)
        .mouseleave(collapse);
      
      navItems.on('mouseenter', expand);
    }
    
    watchPageChanges();
    
    navItems.click(navItemClicked);
    $('.top-nav a').click(navItemClicked);
    
  }
  
  function navItemClicked() {
    // speed up hiding and showing nav (useful on mobile)
    var homeClicked = ($(this).attr("href") === "/");
    // bubble so link handlers happen first
    setTimeout(function() {
      if (homeClicked) {
        $('body').addClass('home');
      }
      else {
        $('body').removeClass('home');
      }
    }, 0);
    // reduces flickering on mobile
    if (homeClicked) {
      sideNav.addClass("white-nav");
    }
  }
  
  function watchPageChanges() {
    $(window).on('url-changed', function() {
      var url = getRelativeUrl();
      if (url === Navigation.lastUrl) { return; }
      
      updateTopNav(url);
      updateSideNav(url);
      updateWhiteNav();
      
    });
  }
  
  function collapse() {
    if (isHome() || !collapsableNav) { return; }
    $('body').addClass('nav-collapsed');
  }
  
  function expand() {
    $('body').removeClass('nav-collapsed');
  }
  
  function isHome() {
    return '/' === location.pathname + location.search;
  }

  function updateWhiteNav() {
    if (isHome()) {
      sideNav.addClass("white-nav");
    }
    else {
      if (collapsableNav) {
        setTimeout(function() {
           sideNav.removeClass("white-nav");
        }, 250);
      }
      else {
        sideNav.removeClass("white-nav");
      }
    }
  }

  function updateSideNav(url) {
    
    // set collapse state on the nav
    if (collapsableNav) {
      if (url === "/") {
        $('body').removeClass('nav-collapsed');
      }
      else {
        $('body').addClass('nav-collapsed');
      }
    }
    
    // Rewrite new page URLs to just their base part
    var match = url.match(/^\/([\w\d-]+)\/?.*/);
    if (!match) {
      navItems.removeClass("selected");
      return;
    }
    var baseUrl = match[1];
    if (baseUrl === "lib") {
      baseUrl = "/library/";
    }
    else if (baseUrl === "news") {
      baseUrl = "/about/";
    }
    else {
      baseUrl = "/" + baseUrl + "/";
    }
    
    // Find the matching nav element 
    var itemToSelect = null;
    navItems.each(function() {
      var link = $(this);
      if (link.attr("href") === baseUrl) {
        itemToSelect = link;
        return;
      }
    });
    
    // change selected classes
    navItems.removeClass("selected");
    if (itemToSelect) {
      itemToSelect.addClass("selected");
    }
    
  }

  function updateTopNav(url) {
    var backUrl = '/';
    var backLabel = 'GV';
    var bodyClass = 'home';

    if (/^\/design\/.+/.test(url)) {
      backUrl = '/design/';
      backLabel = 'Design';
      bodyClass = '';
    }
    else if (/^\/team\/.+$/.test(url)) {
      backUrl = '/team/';
      backLabel = 'Team';
      bodyClass = '';
    }
    else if (/^\/news\/.+$/.test(url)) {
      backUrl = '/about/';
      backLabel = 'About';
      bodyClass = '';
    }
    else if (/^\/workshops\/.+$/.test(url)) {
      backUrl = '/workshops/';
      backLabel = 'All';
      bodyClass = '';
    }
    else if (/^\/library\/.+$/.test(url)) {
      backUrl = '/library/';
      backLabel = 'Library';
      bodyClass = '';
    }
    else if (/^\/lib\/.+$/.test(url)) {
      backUrl = '/library/';
      backLabel = 'GV Library';
      bodyClass = '';
      // Detect if you visitited a category
      if (FeatureDetection['history']) {
        var lastUrl = History.getStateByIndex(History.getCurrentIndex()-1).url;
        var match = /\/library\/([\w\d-]+)\/?$/.exec(lastUrl);
        if (match) {
          backLabel = match[1].replace("-", " ");
          backLabel = backLabel.charAt(0).toUpperCase() + backLabel.slice(1);
          backUrl = '/library/' + match[1] + '/';
        }
      }
    }
    
    $('.btn.back', topNav)
      .attr('href', backUrl)
      .find('.label').text(backLabel)
      .unbind('click.bodyclass')
      .bind('click.bodyclass', function() {
        $('body').addClass(bodyClass);
      });
  }
  
})();
