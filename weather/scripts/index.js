( function( root, $ ) {


var app = {
		models : {},
		views : {}
	},
	FIVE_DIGITS = /^\d{5}$/;

$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
	switch ( options.name  ) {
		case 'weather' :
			app.views.weather.preFetch();
	}
});

var WeatherModel = Backbone.Model.extend({
	urlRoot : 'https://query.yahooapis.com/v1/public/yql?',
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
		if ( data.count === 0 || data.results.channel.description === 'Yahoo! Weather Error' ) {
			var msg = 'please be more specific.';
			console.log( 'validate Error', msg );
			return msg;
		}
	},
	removeErrors : function( data ) {
		return _.reject( data, function( item ) {
			return item.description === "Yahoo! Weather Error";
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
			console.log( 'error WeatherView', arguments );
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
			if ( !data[0] ) return this.fail( 'please be more specific.' );
		}

		app.views.loading.autoEl( 'got your weather', true );

		console.log( 'render WeatherView', data );

		var html = tpl( this.template, data );
		this.el.html( html );

		this.el.removeClass( 'off' );
	},
	fail : function( msg ) {
		if ( !msg || !_.isString(msg) ) {
			msg = 'oops, try again.';
		}
		app.views.loading.autoEl( msg, true );
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
		if ( !value ) return;

		console.log( value );

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
			if ( $clearElms ) $clearElms.addClass( 'off' );
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
		this.autoEl( 'problem finding you, sorry. use the search below.' );
	}
});

app.init = function() {
	app.models.weather = new WeatherModel;
	app.models.geo = new GeoModel;

	app.views.weather = new WeatherView({
		model : app.models.weather
	});
	app.views.search = new SearchView;
	app.views.loading = new LoadingView;

	// watch for change event on geolocation
	app.models.geo.bind( 'change', function( model ) {
		var ll = model.getLatLon();

		// on success of getting lat,lon - fetch the weather
		app.models.weather.fetchWeather( ll );
	});

	// find the user
	app.models.geo.fetch()
		.done( app.views.loading.render )
		.fail( app.views.loading.fail );
};

app.init();

root.app = app;


})( this, jQuery );