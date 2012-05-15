$.jqotetag '*'

templates = {}

parse = (_o) ->
	a = []
	for p of _o
		if _o.hasOwnProperty(p)
			t = _o[p]
			if t and typeof t == "object"
				a[a.length] = p + ":{ " + arguments.callee(t).join(", ") + "}"
			else
				if typeof t == "string"
					a[a.length] = [ p + ": \"" + t.toString() + "\"" ]
				else
					a[a.length] = [ p + ": " + t.toString() ]
	a

objectToString = (o) ->
	"{" + parse(o).join(", ") + "}"

getTemplates = ( path ) ->
	$.ajax({
		url : path
		dataType : 'html'
		async : false
	}).done ( data ) ->
		$( data ).filter( 'script' ).each ->
			templates[ @.id ] = $.jqotec( @ )

getTemplates 'templates/templates.tpl'

$( '<textarea />' )
	.val( objectToString( templates ) )
	.css( width : '100%', height : '100%' )
	.appendTo( document.body )