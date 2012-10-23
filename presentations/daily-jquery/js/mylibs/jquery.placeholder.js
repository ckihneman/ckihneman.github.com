/*
@author 	Chris Kihneman
@company 	Mindgruve
@date 		8.24.2012

*/

( function( $, root ) {

	var isInputSupported = 'placeholder' in document.createElement('input'),
		isTextareaSupported = 'placeholder' in document.createElement('textarea');

	$.placeholder = function( options ) {

		// If we have support, dont do anything.
		if ( isInputSupported && isTextareaSupported ) {
			return this;
		}

		// We are missing placeholder support for something.

		options = $.extend( {}, $.placeholder.defaults, options || {} );

		var selectors = [],
			$els, handler;
		if ( !isInputSupported ) selectors.push( 'input' );
		if ( !isTextareaSupported ) selectors.push( 'textarea' );

		handler = function( e ) {
			var $this = $( this ),
				value = $this.val(),
				placeholder = $this.attr('placeholder');
			if ( e.type === 'focus' ) {
				$this.removeClass( options.className );
				if ( value === placeholder ) {
					$this.val( '' );
				}
			} else {
				if ( $this.val() === '' ) {
					$this.addClass( options.className )
						.val( placeholder );
				} else {
					$this.removeClass( options.className );
				}
			}
		};

		$els = $( selectors.join(', ') ).each( function() {
			var $this = $( this ),
				placeholder = $this.attr( 'placeholder' );

			// If there is no placeholder, do nothing.
			if ( !placeholder || $this.data('is-placeholder') ) return;

			// Otherwise set the intial value to the placeholder.
			$this.val( placeholder );

			// And bind the handler to it.
			$this.on( 'focus.placeholder blur.placeholder', handler )

				// Add data to ensure we do not rebind on this element.
				.data( 'is-placeholder', true );
		});

		return this;
	};
	$.placeholder.defaults = {
		className : 'placeholder'
	};

})( jQuery, this );
