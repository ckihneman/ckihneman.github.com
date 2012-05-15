// Chris Kihneman

(function( root ) {
	var noop = function(){};
	if ( !console ) root.console = {
		log : noop
	}
})( this );