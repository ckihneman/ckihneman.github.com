/*
@author 	Chris Kihneman
@company 	Mindgruve
@date 		8.24.2012

*/

( function( $, root ) {

	$.fn.readMore = function( options ) {
		options = $.extend( {}, $.fn.readMore.defaults, options || {} );

		return this.each( function () {

			var $el = $( this );

			if ( options.lines !== '0' ) {
				options.height = options.lines * parseFloat( $el.css('line-height'), 10 );
			}

			var originalHeight = $el.height();

			// Stop if height is already to size.
			if ( originalHeight <= options.height ) return;

			$el.css( 'height', options.height );

			var $button;
			if ( options.buildButton && options.buttonHtml ) {
				$button = $( options.buttonHtml );
				$el.after( $button );
				$button = $button.find( 'a' );
			} else {
				$button = $el.siblings('.read-more-toggle').find('a')
			}

			var isClosed = true;
			$button.html( options.openText ).click( function( e ) {
				var height, text;
				e.preventDefault();
				if ( isClosed ) {
					height = originalHeight;
					text   = options.closeText;
					isClosed = false;
				} else {
					height = options.height;
					text   = options.openText;
					isClosed = true;
				}
				$button.html( text );
				$el.css( 'height', height );
			});

			// Have to wait to apply a class that has
			// the animation styles on them.
			// Otherwise the text height will animate when
			// initially setting it.
			setTimeout( function() {
				$el.addClass( options.readyClassName );
			}, 10 );

		});
	};

	$.fn.readMore.defaults = {
		height      : '100px',

		// NOTE: To use this the line-height must be the same throughout the selected area. This will override the height setting.
		lines       : 4,

		// NOTE: If false, you will need to have <div class="slider_menu"><a href="#">Read More</a></div> added in the html following the partial sliding area.
		buildButton : true,
		buttonHtml  : '<div class="read-more-toggle"><a href="#"></a></div>',
		openText    : 'Read More',
		closeText   : 'Close',
		animTime    : 'slow',
		readyClassName : 'ready'
	};

})( jQuery, this );