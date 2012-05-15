(function() {

  $.prototype.codify = function() {
    this.addClass('prettyprint');
    return prettyprint();
  };

  $(function() {
    return $('#logo').on('click', function() {
      return window.location = '/';
    });
  });

}).call(this);
