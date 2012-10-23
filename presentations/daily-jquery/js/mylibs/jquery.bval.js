/*  Author: Chris Kihneman
	Company: Mindgruve
*/

// closure to protect global scope
( function( $ ) {

	// Convert serialized array of objects into single object.
	//
	// @param `arr` Array : name/value objects
	// @return `output` Object 2: key/value pairs of form data
	var serializeMap = function( arr ) {

		// Fresh object to extend values to
		var output = {};

		// Loop through `arr`
		for ( var i = 0, l = arr.length; i < l; i++ ) {

			// Cache item in array to work with
			var item = arr[i];

			// Extend the data on item to `output`
			// Trim data to remove unnecessary spaces
			output[ item.name ] = $.trim( item.value );
		}

		// Return extended object
		return output;
	};

	// Wrap form submission and bValidator functionality.
	//
	// @param o Object : settings for form
	$.fn.bVal = function( o ) {

		// Cache `this` for use in submit handler
		var $form = this;

		// Instantiate bValidator on form with options provided by `o`
		this.bValidator( o.bValidator || {} );

		// Attach callback to form submit event
		this.submit( function( e ) {

			// Suppress default behavior for a form submission,
			// as in do no refresh the page.
			e.preventDefault();

			// When you instantiate bValidator, it attaches some methods
			// to the forms data object that jQuery handles.

			// Cache a refrence to the bValidators data
			var data = $form.data( 'bValidator' );

			// Checking for `data` before calling its isValid method ensures
			// that `data` actually exists. If it didn't, we would get an
			// error here without this catch.

			// I'm also ensuring that we have an onValid handler, if we
			// don't have the handler then there is no reason to serialize
			// the form data.

			// Validate form data
			if ( data && data.isValid() && o.onValid ) {

				// If the user has passed `o.isMapped = true` then
				// return them a map of form data
				var mapped = o.isMapped ?
					serializeMap( $form.serializeArray() ) :
					null;

				// Call `o.onValid` with $form as `this` value.
				// Pass in bValidator `data` and the mapped form elements.
				o.onValid.call( $form, data, mapped );
			}

		});

		// Ensure jQuery chaining syntax
		return this;

	};

	// Initializer for multiple forms.
	// Will not run on forms that do not exist.
	//
	// @param forms Object : key = form selector, value = bVal options
	$.bVal = function( forms ) {
		var selector, $form;
		for ( selector in forms ) {
			$form = $( selector );
			if ( $form.length ) {
				$form.bVal( forms[ selector ] );
			}
		}
	};

})( jQuery );



// # Example usage

// ## HTML

// <form id="formElement">
//  <input type="text" name="email" id="email" data-bvalidator="required">
//  <input type="submit" value="GO">
// </form>


// ## JavaScript

// $( '#formElement' ).bVal({
//  isMapped : true,
//  bValidator : {
//    offset : {
//      x : -90,
//      y : -10
//    }
//  },
//  onValid : function( bValData, map ) {

//    // `this` is the form element
//    // `bValData` is the data attached by bValidator
//    // `map` is the object of form data (if requested by `isMapped:true`)
//    var email = map.email;
//    console.log( 'form submit', email, this );
//  }
// });



