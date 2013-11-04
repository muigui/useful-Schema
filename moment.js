	Schema.Date            = {
		clone   : function( date ) {
			return moment( date ).clone().toDate();
		},
		coerce  : function( date_str, format ) {
			return moment( date_str, format, true ).toDate();
		},
		format  : function( date, format ) {
			return moment( date ).format( format );
		}
	};