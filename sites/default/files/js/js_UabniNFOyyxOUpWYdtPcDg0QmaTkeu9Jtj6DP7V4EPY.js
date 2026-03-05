(function ($) {
    Drupal.behaviors.YourBehaviour = {
        attach: function(context, settings) {
		
		
		//mobile trending
		
		if ($(window).width() <= 767){ 
			$( ".block-quicktabs h2.block-title" ).text( "Mobile Trading");
			
			
			   // quicklinks below banner
			/*	$('#block-quicktabs-quicktabs-main-mobile h2').click(function () {
					$(this).parent().find('.quicktabs-tabs').slideToggle();
					$(this).toggleClass('collapsed');
				}); */
				
				$('.block-quicktabs h2').click(function () {
					$(this).parent().find('.quicktabs-tabs').slideToggle();
					$(this).toggleClass('collapsed');
				});
				
				//responsive tables
				// $('.view-spreadbetting-companies .view-content').addClass('table-responsive');
			
		}

		//contact us
			$( "button.btn-primary" ).text( "SEND");

        }
    }
})(jQuery);

(function ($) {
    Drupal.behaviors.lhsmenu = {
        attach: function(context, settings) {
		
		// lhs menu
		$('.region-sidebar-first .companies-list').hover(function () {
			$(this).find('.view-content').show();
			$(this).parent().find('form').hide();
		});
		// lhs search
			$('.region-sidebar-first .block-search').hover(function (){
			$(this).find('form').show();
			$(this).parent().find('.view-content').hide();
		});

		$('.region-sidebar-first .companies-list, .region-sidebar-first .block-search').mouseleave(function () {
			$(this).parent().find('.view-content, form').hide();
		});

		if ($(window).width() <= 767){ 
			// lhs menu
			$('.region-sidebar-first .companies-list').click(function () {
				$(this).find('.view-content').show();
				$(this).parent().find('form').hide();
			});
			// lhs search
			$('.region-sidebar-first .block-search').click(function () {
				$(this).find('form').show();
				$(this).parent().find('.view-content').hide();
			});

			
		}

        }
    }
})(jQuery);;
