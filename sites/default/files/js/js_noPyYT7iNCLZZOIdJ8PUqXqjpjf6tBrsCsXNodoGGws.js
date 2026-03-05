/**
 * @file
 * Default JS callbacks for the Menu_MiniPanels module.
 */

/**
 * If either of these callbacks need to be customized then the following must
 * be done:
 *  1. Disable the "Load default JS callbacks" option on the main settings
 *     page.
 *  2. Copy this file to a new location and set it to load as necessary, e.g.
 *     by adding it to the site's theme directory and listing it on the theme's
 *     .info file.
 *  3. Customize as necessary, see API.txt for further details of the callbacks
 *     that are available for use.
 */
(function($) {

  Drupal.behaviors.menuMiniPanelsCallbacks = {
    attach: function(context, settings) {

      // Mark target element as selected.
      MenuMiniPanels.setCallback('beforeShow', function(qTip, event, content) {
        // Forceably remove the class off all DOM elements, avoid problems
        // of it not being properly removed in certain scenarios.
        $('.qtip-hover').removeClass('qtip-hover');

        // Add the hover class to the current item.
        var $target = $(qTip.elements.target.get(0));
        if ($target !== undefined) {
          $target.addClass('qtip-hover');
        }
      });

      // Unmark target element as selected.
      MenuMiniPanels.setCallback('beforeHide', function(qTip, event, content) {
        // Remove the class off all DOM elements.
        $('.qtip-hover').removeClass('qtip-hover');
      });

      // Integrate with the core Contextual module.
      MenuMiniPanels.setCallback('onRender', function(qTip, event, content) {
        $('div.menu-minipanels div.contextual-links-wrapper', context).each(function () {
          var $wrapper = $(this);
          // Remove the popup link added from the first time the Contextual
          // module processed the links.
          $wrapper.children('a.contextual-links-trigger').detach();
          // Continue as normal.
          var $region = $wrapper.closest('.contextual-links-region');
          var $links = $wrapper.find('ul.contextual-links');
          var $trigger = $('<a class="contextual-links-trigger" href="#" />').text(Drupal.t('Configure')).click(
            function () {
              $links.stop(true, true).slideToggle(100);
              $wrapper.toggleClass('contextual-links-active');
              return false;
            }
          );
          // Attach hover behavior to trigger and ul.contextual-links.
          $trigger.add($links).hover(
            function () { $region.addClass('contextual-links-region-active'); },
            function () { $region.removeClass('contextual-links-region-active'); }
          );
          // Hide the contextual links when user clicks a link or rolls out of
          // the .contextual-links-region.
          $region.bind('mouseleave click', Drupal.contextualLinks.mouseleave);
          // Prepend the trigger.
          $wrapper.prepend($trigger);
        });
      });

    }
  };
})(jQuery);
;
(function ($) {
Drupal.settings.views = Drupal.settings.views || {'ajax_path': '/views/ajax'};

Drupal.quicktabs = Drupal.quicktabs || {};

Drupal.quicktabs.getQTName = function (el) {
  return el.id.substring(el.id.indexOf('-') +1);
}

Drupal.behaviors.quicktabs = {
  attach: function (context, settings) {
    $.extend(true, Drupal.settings, settings);
    $('.quicktabs-wrapper', context).once(function(){
      Drupal.quicktabs.prepare(this);
    });
  }
}

// Setting up the inital behaviours
Drupal.quicktabs.prepare = function(el) {
  // el.id format: "quicktabs-$name"
  var qt_name = Drupal.quicktabs.getQTName(el);
  var $ul = $(el).find('ul.quicktabs-tabs:first');
  $ul.find('li a').each(function(i, element){
    element.myTabIndex = i;
    element.qt_name = qt_name;
    var tab = new Drupal.quicktabs.tab(element);
    var parent_li = $(element).parents('li').get(0);
    if ($(parent_li).hasClass('active')) {
      $(element).addClass('quicktabs-loaded');
    }
    $(element).once(function() {$(this).bind('click', {tab: tab}, Drupal.quicktabs.clickHandler);});
  });
}

Drupal.quicktabs.clickHandler = function(event) {
  var tab = event.data.tab;
  var element = this;
  // Set clicked tab to active.
  $(this).parents('li').siblings().removeClass('active');
  $(this).parents('li').addClass('active');

  // Hide all tabpages.
  tab.container.children().addClass('quicktabs-hide');
  
  if (!tab.tabpage.hasClass("quicktabs-tabpage")) {
    tab = new Drupal.quicktabs.tab(element);
  }

  tab.tabpage.removeClass('quicktabs-hide');
  return false;
}

// Constructor for an individual tab
Drupal.quicktabs.tab = function (el) {
  this.element = el;
  this.tabIndex = el.myTabIndex;
  var qtKey = 'qt_' + el.qt_name;
  var i = 0;
  for (var i = 0; i < Drupal.settings.quicktabs[qtKey].tabs.length; i++) {
    if (i == this.tabIndex) {
      this.tabObj = Drupal.settings.quicktabs[qtKey].tabs[i];
      this.tabKey = i;
    }
  }
  this.tabpage_id = 'quicktabs-tabpage-' + el.qt_name + '-' + this.tabKey;
  this.container = $('#quicktabs-container-' + el.qt_name);
  this.tabpage = this.container.find('#' + this.tabpage_id);
}

if (Drupal.ajax) {
  /**
   * Handle an event that triggers an AJAX response.
   *
   * We unfortunately need to override this function, which originally comes from
   * misc/ajax.js, in order to be able to cache loaded tabs, i.e. once a tab
   * content has loaded it should not need to be loaded again.
   *
   * I have removed all comments that were in the original core function, so that
   * the only comments inside this function relate to the Quicktabs modification
   * of it.
   */
  Drupal.ajax.prototype.eventResponse = function (element, event) {
    var ajax = this;

    if (ajax.ajaxing) {
      return false;
    }
  
    try {
      if (ajax.form) {
        if (ajax.setClick) {
          element.form.clk = element;
        }
  
        ajax.form.ajaxSubmit(ajax.options);
      }
      else {
        // Do not perform an ajax request for already loaded Quicktabs content.
        if (!$(element).hasClass('quicktabs-loaded')) {
          ajax.beforeSerialize(ajax.element, ajax.options);
          $.ajax(ajax.options);
          if ($(element).parents('ul').hasClass('quicktabs-tabs')) {
            $(element).addClass('quicktabs-loaded');
          }
        }
      }
    }
    catch (e) {
      ajax.ajaxing = false;
      alert("An error occurred while attempting to process " + ajax.options.url + ": " + e.message);
    }
    return false;
  };
}


})(jQuery);
;
