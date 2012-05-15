// by Chris Kihneman @ Mindgruve

(function ($) {
	
	var noTransition, doOne, waterfaller, waterfallDelay,
		raf = webkitRequestAnimationFrame;
	
	noTransition = function( cb ) {
		var _this = this;
			// css = this.css( '-webkit-transition' );
		this.css( '-webkit-transition-property', 'none' );
		// _log( '--! CSS', css );
		setTimeout( function() {
			cb.call( _this );
			_this.css( '-webkit-transition-property', 'all' );
			// _log( '--! CSS', css );
			// _this[ method ]( className ).css( '-webkit-transition', css );
		}, 0 );
		return this;
	};
	
	$.fn.noTrans = function( cb ) {
		return noTransition.call( this, cb );
	};
	$.fn.addClassNT = function( className ) {
		// return noTransition.call( this, 'addClass', className );
		return this.noTrans( function() {
			this.addClass( className );
		});
	};
	$.fn.removeClassNT = function( className ) {
		// return noTransition.call( this, 'removeClass', className );
		return this.noTrans( function() {
			this.removeClass( className );
		});
	};
	
	
	doOne = function( eventType, method, className, fn ) {
		return this.one( eventType, $.proxy(fn, this) )[ method ]( className );
	};
	
	$.fn.addClassAnim = function( className, fn ) {
		return doOne.call( this, 'webkitAnimationEnd', 'addClass', className, fn );
	};
	$.fn.addClassTrans = function( className, fn ) {
		return doOne.call( this, 'webkitTransitionEnd', 'addClass', className, fn );
	};
	$.fn.removeClassAnim = function( className, fn ) {
		return doOne.call( this, 'webkitAnimationEnd', 'removeClass', className, fn );
	};
	$.fn.removeClassTrans = function( className, fn ) {
		return doOne.call( this, 'webkitTransitionEnd', 'removeClass', className, fn );
	};
	
	
	$.fn.dbWrap = function( cb, css ) {
		this.css( 'display', css || 'block' );
		cb = cb.bind( this );
		setTimeout( cb, 0 );
		return this;
	};
	
	
	waterfaller = function( o ) {
		var _this = this;
		return function x( $elms, i ) {
			i || (i = 0);
			o.action.call( $elms.eq( 0 ), $elms.length );
			if ( ($elms = $elms.slice(1)).length ) {
				setTimeout( function() {
					i += 1;
					x( $elms, i );
				}, o.delayer && o.delayer( o.delay, i ) || o.delay );
			} else if ( o.cb ) o.cb.call( _this );
		}
	};
	
	$.fn.waterfall = function( o ) {
		o.delay || (o.delay = waterfallDelay);
		( waterfaller.call( this, o ) )
			( o.count && this.length > o.count ? this.slice( 0, o.count ) : this );
		return this;
	};
	$.fn.waterfall.delay = waterfallDelay = 200;
	
	$.fn.waterfallClass = function( o ) {
		var _this = this,
			options = $.extend( {}, o, {
				action: function( i ) {
					if ( i > 1 ) this[ o.action + 'Class' ]( o.className );
					else this[ o.action + 'ClassTrans' ]( o.className, function() {
						if ( o.cb ) o.cb.call( _this ), _log( ' END in waterfall cb' );
					}), _log( '  in waterfall cb' );
				}
			});
		delete options.cb;
		return this.waterfall( options );
	};
	

})(jQuery);




























