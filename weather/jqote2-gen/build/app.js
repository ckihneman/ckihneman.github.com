(function() {
  var getTemplates, objectToString, parse, templates;
  $.jqotetag('*');
  templates = {};
  parse = function(_o) {
    var a, p, t;
    a = [];
    for (p in _o) {
      if (_o.hasOwnProperty(p)) {
        t = _o[p];
        if (t && typeof t === "object") {
          a[a.length] = p + ":{ " + arguments.callee(t).join(", ") + "}";
        } else {
          if (typeof t === "string") {
            a[a.length] = [p + ": \"" + t.toString() + "\""];
          } else {
            a[a.length] = [p + ": " + t.toString()];
          }
        }
      }
    }
    return a;
  };
  objectToString = function(o) {
    return "{" + parse(o).join(", ") + "}";
  };
  getTemplates = function(path) {
    return $.ajax({
      url: path,
      dataType: 'html',
      async: false
    }).done(function(data) {
      return $(data).filter('script').each(function() {
        return templates[this.id] = $.jqotec(this);
      });
    });
  };
  getTemplates('templates/templates.tpl');
  $('<textarea />').val(objectToString(templates)).css({
    width: '100%',
    height: '100%'
  }).appendTo(document.body);
}).call(this);
