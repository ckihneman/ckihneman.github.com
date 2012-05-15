
( function( root, $ ) {
	
	var geolocator, fallback, mmDfr,
		hasSupport = !!navigator.geolocation;

	if ( !hasSupport ) {
		mmDfr = $.Deferred();
		$.getScript( 'http://j.maxmind.com/app/geoip.js', function() {
			mmDfr.resolve();
		});
	}

	geolocator = function() {
		var dfr = $.Deferred();

		if ( hasSupport ) {

			navigator.geolocation.getCurrentPosition( function( pos ) {
				dfr.resolve({
					lat : pos.coords.latitude,
					lon : pos.coords.longitude
				});
			}, function() {
				dfr = fallback();
			});

		} else {
			dfr = fallback();
		}

		return dfr.promise();
	};

	fallback = function() {
		var dfr = $.Deferred();

		mmDfr.done( function() {

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

		return dfr.promise();
	};

	root.GeoModel = Backbone.Model.extend({
		ERROR_MSG : 'failed to find you',
		sync : geolocator,
		fetch : function() {
			var model = this;
			return this.sync().done( function( pos ) {
				model.set( pos );
			}, function() {
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