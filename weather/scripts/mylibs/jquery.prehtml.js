// by Chris Kihneman @ Mindgruve

$.fn.preHtml = function( html, options ) {
	
	var _this = $.fn.preHtml,
		o = $.extend( {}, $.fn.preHtml.defaults, options ),
		$html = $( html ),
		$images = $html.find( '.' + o.className );
	
	$images.each( function() {
		
		var $loader, image = this,
			$image = $( this ),
			$parent = $image.parent();
			
		if ( image.complete ) {
			// do nothing, image is cached
		} else {
			$loader = $( _this.styles[ o.style ] );
			$parent.append( $loader );
			$image.addClass( 'off' );
			$image.one( 'load error', function( e ) {
				if ( e.type === 'load' ) {
					$image.removeClass( 'off' );
					$loader.addClass( 'off' );
				} else {
					$parent.addClass( 'noImage' );
					this.src = _this.defaults.fallback;
					$image.trigger( 'load' );
					e.preventDefault();
				}
			});
			$image.one( 'webkitAnimationEnd webkitTransitionEnd', function() {
				$loader.remove();
			});
		}
		
	});
	
	return this.empty().append( $html );
	
};

$.fn.preHtml.defaults = {
	className : 'preload',
	style : 'circular',
	fallback : 'images/logo.png'
};

$.fn.preHtml.styles = {
	circular : '<div class="loaderWrap">' +
			'<div class="loader opacity">' +
				'<div class="circular circular_1"></div>' +
				'<div class="circular circular_2"></div>' +
				'<div class="circular circular_3"></div>' +
				'<div class="circular circular_4"></div>' +
				'<div class="circular circular_5"></div>' +
				'<div class="circular circular_6"></div>' +
				'<div class="circular circular_7"></div>' +
				'<div class="circular circular_8"></div>' +
			'</div>' +
		'</div>'
};