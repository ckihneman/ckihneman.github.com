/*
@author 	Chris Kihneman
@company 	Mindgruve
@date 		8.23.2012

*/

( function( $, root ) {

	// Set all elements to the height of the tallest element.
	$.fn.setMaxHeight = function() {
		return this.length < 2 ? this : this.height(
			Math.max.apply( this,
				$.map( this , function( e ) {
					return $( e ).height();
				})
			)
		);
	};

	// Set groups of elements to the tallest element of the group.
	//
	// To use add `data-max-height="group-name"` to any elements.
	//
	// Change the attributes value to set different groups.
	// Elements with no value set will group together.
	$.fn.setMaxHeightGroups = function( options ) {
		if ( this.length < 2 ) return this;
		var groups = {};
		options = $.extend( {}, $.fn.setMaxHeightGroups.defaults, options );
		this.each( function() {
			var $el = $( this ),
				group = $el.data( options.dataAttr ) || options.defaultGroup;
			groups[ group ] = !groups[ group ] ? $el : groups[ group ].add( $el );
		});
		for ( var group in groups ) {
			groups[ group ].setMaxHeight();
		}
		return this;
	};
	$.fn.setMaxHeightGroups.defaults = {
		dataAttr : 'max-height',
		defaultGroup : 'no-name'
	};

})( jQuery, this );
