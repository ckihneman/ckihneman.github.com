// Chris Kihneman

( function( root, $ ) {

var app = {
		models : {},
		views : {}
	};

$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
	if ( options.name === 'weather' ) {
		app.views.weather.preFetch();
	}
});

var WeatherModel = Backbone.Model.extend({
	urlRoot : 'https://query.yahooapis.com/v1/public/yql?',
	YAHOO_ERROR : 'Yahoo! Weather Error',
	fetchWeather : function( text ) {
		return this.fetch({
			name : 'weather',
			dataType : 'jsonp',
			data : {
				q : 'select * from weather.forecast where location in (select uzip from geo.placefinder where text="' + text + '" and gflags="R")',
				format : 'json'
			},
			timeout : 10000
		});
	},
	parse : function( data ) {
		return data.query;
	},
	validate : function( data ) {
		if ( data.count === 0 || data.results.channel.description === this.YAHOO_ERROR ) {
			return 'please be more specific.';
		}
	},
	removeErrors : function( data ) {
		var model = this;
		return _.reject( data, function( item ) {
			return item.description === model.YAHOO_ERROR;
		});
	}
});

var WeatherView = Backbone.View.extend({
	el : $( '#weather' ),
	template : templates.weather,
	initialize : function() {
		var view = this;
		this.model.bind( 'change', function( model ) {
			view.render( model.toJSON() );
		});
		this.model.bind( 'error', function( model, msg ) {
			view.fail( msg );
		});
	},
	preFetch : function() {
		app.views.loading.autoEl( 'getting your weather' );
		this.el.addClass( 'off' );
	},
	render : function( data ) {
		data = data.results.channel;

		// could get multipule result sets passed back
		// some could have errors, remove those.
		if ( _.isArray( data ) ) {
			data = this.model.removeErrors( data );
			if ( !data[0] ) {
				return this.fail( 'please be more specific.' );
			}
		}

		app.views.loading.autoEl( 'got your weather', true );

		var html = tpl( this.template, data );
		this.el.html( html );

		var $highcharts = this.el.find( '.highchart' );

		// super lame try/catch
		// android is only supported in version 3+
		try {
			this.makeHighcharts( $highcharts, data.item.forecast );
		} catch( e ) {
			$highcharts.css( 'display', 'none' );
		}

		this.el.removeClass( 'off' );
	},
	fail : function( msg ) {
		if ( !msg || !_.isString(msg) ) {
			msg = 'oops, try again.';
		}
		app.views.loading.autoEl( msg, true );
	},
	makeHighcharts : function( $el, data ) {
		var cats = _.pluck( data, 'day' ),
			high = _.map( data, function( item ) {
				return parseInt( item.high, 10 );
			}),
			low = _.map( data, function( item ) {
				return parseInt( item.low, 10 );
			});

		var o = {
			chart : {
				renderTo : $el[0],
				type : 'spline',
				height : 300
			},
			title : {
				text : 'Highs and Lows Forecast'
			},
			xAxis : {
				categories: cats
			},
			yAxis : {
				title : {
					text : 'Temperature (F)'
				}
			},
			series : [{
				name : 'Low',
				data : low
			}, {
				name : 'High',
				data : high
			}]
		};

		this.chart = new Highcharts.Chart( o );
	}
});

var SearchView = Backbone.View.extend({
	el : $( '#search' ),
	events : {
		'submit' : 'search'
	},
	initialize : function() {
		this.$input = this.el.children().eq(0);
	},
	search : function( e ) {
		var value = $.trim( this.$input.val() );

		e.preventDefault();

		// Nothing entered - no action
		if ( !value ) {
			return;
		}

		app.models.weather.fetchWeather( value );
	}
});

var LoadingView = Backbone.View.extend({
	el : $( '#loading' ),
	initialize : function() {
		this.render = _.bind( this.render, this );
		this.fail = _.bind( this.fail, this );
		this.autoEl( 'finding you...' );
	},
	autoEl : function( msg, isClear ) {
		var model = this,
			$el = $( '<p class="off">' + msg + '</p>' );
		
		if ( isClear ) {
			var $clearElms = this.el.children();
		}

		this.el.append( $el );

		// timeout to wait for repaint so css can animate
		setTimeout( function() {
			if ( $clearElms ) {
				$clearElms.addClass( 'off' );
			}
			$el.removeClass( 'off' );
		}, 0 );

		if ( isClear ) {
			setTimeout( function() {
				$el.addClass( 'off' );
				$clearElms.remove();
			}, 2000 );
		}
	},
	render : function() {
		this.autoEl( 'found you!', true );
	},
	fail : function() {
		this.autoEl( 'problem finding you, sorry. try the search box.' );
	}
});

app.init = function() {
	app.models.weather = new WeatherModel();
	app.models.geo = new GeoModel();

	app.views.weather = new WeatherView({
		model : app.models.weather
	});
	app.views.search = new SearchView();
	app.views.loading = new LoadingView();

	// watch for change event on geolocation
	app.models.geo.bind( 'change', function( model ) {
		var ll = model.getLatLon();

		// on success of getting lat,lon - fetch the weather
		app.models.weather.fetchWeather( ll );
	});
	app.models.geo.bind( 'error', function( model, msg ) {
		app.views.loading.fail( msg );
	});

	// find the user
	app.models.geo.fetch()
		.done( app.views.loading.render );
};

app.init();

root.app = app;


})( this, jQuery );