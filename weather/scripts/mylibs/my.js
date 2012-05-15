// by Chris Kihneman @ Mindgruve

(function() {
	var aps = Array.prototype.slice;
	this._log = function() {
		_log.history.push( arguments );
		if ( _log.isValid ) {
			console.log.apply( console, aps.call( arguments ) );
		}
	};
	_log.history = [];
	_log.isValid = this.console ? true : false;
	_log.startTime = +new Date();
	_log.runTime = function() {
		var args = aps.call( arguments ),
			runTime = +new Date() - this.startTime;
		args.unshift( 'Run Time :', runTime, 'ms :' );
		this.apply( this, args );
	};

	this.ls = this.localStorage;
	this.lsc = function() {
		ls.clear.call( ls );
		_log( 'localStorage.clear()' );
	};
})();