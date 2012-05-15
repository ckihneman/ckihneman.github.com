// Chris Kihneman

(function(){
	var directions = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
	
	_.mixin({

		// convert degrees to direction
		toDirection : function( deg ) {
			deg = parseInt( deg, 10 );
			return directions[ Math.round( deg / 22.5 ) ];
		}
	});
	
})();