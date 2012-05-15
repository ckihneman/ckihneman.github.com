// Chris Kihneman

( function( root, $ ) {
	
	var ensureFallback, geolocator, fallback, mmDfr,
		hasSupport = !!navigator.geolocation;

	ensureFallback = function() {
		if ( !mmDfr ) {
			mmDfr = $.getScript( 'http://j.maxmind.com/app/geoip.js' );
		}
		return mmDfr;
	};

	geolocator = function() {
		var dfr = $.Deferred();

		if ( hasSupport && !$.browser.msie ) {

			navigator.geolocation.getCurrentPosition( function( pos ) {
				dfr.resolve({
					lat : pos.coords.latitude,
					lon : pos.coords.longitude
				});
			}, function() {
				dfr = fallback(dfr);
			});

		} else {
			dfr = fallback(dfr);
		}

		return dfr.promise();
	};

	fallback = function( dfr ) {
		var scriptDfr = ensureFallback();

		scriptDfr.done( function() {
			if ( geoip_latitude && geoip_longitude ) {
				dfr.resolve({
					lat : geoip_latitude(),
					lon : geoip_longitude()
				});
			} else {
				dfr.reject();
			}
		}).fail( function() {
			dfr.reject();
		});

		return dfr;
	};

	root.GeoModel = Backbone.Model.extend({
		ERROR_MSG : 'failed to find you',
		sync : geolocator,
		fetch : function() {
			var model = this;
			return this.sync().done( function( pos ) {
				model.set( pos );
			}).fail( function() {
				model.trigger( 'error', model, model.ERROR_MSG );
			});
		},
		getLat : function() {
			return this.get( 'lat' );
		},
		getLon : function() {
			return this.get( 'lon' );
		},
		getLatLon : function() {
			var lat = this.getLat(),
				lon = this.getLon();
			return lat && lon ? lat + ',' + lon : undefined;
		}
	});

})( this, jQuery );