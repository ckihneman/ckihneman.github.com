// by Chris Kihneman @ Mindgruve

(function(){
	var dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		directions = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
	
	_.mixin({
		toDirection : function( deg ) {
			deg = parseInt( deg, 10 );
			return directions[ Math.round( deg / 22.5 ) ];
		},
		parseDateTime : function( date ) { // Mon Jul 19 12:43pm
			return _.parseDate( date ) + ' ' + _.parseTime( date );
		},
		parseDate : function( date ) { // Mon Jul 19
			return dow[ date.getDay() ] + ' ' + months[ date.getMonth() ] + ' ' + date.getDate();
		},
		parseTime : function( date ) { // 12:43pm
			var amPm, hour = date.getHours();
			amPm = hour < 12 ? 'AM' : 'PM';
			hour = hour === 0 ? 12 : ( hour > 12 ? hour -= 12 : hour );
			return _.padNum( hour ) + ':' + _.padNum( date.getMinutes() ) + amPm;
		},
		padNum : function( n ) {
			return n < 10 ? '0' + n : n;
		}
	});
	
})();