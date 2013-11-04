	Schema.Date            = {
		clone   : function( date ) {
			return date.clone();
		},
		coerce  : function( date_str, format ) {
			return Date.coerce( date_str, format );
		},
		format  : function( date, format ) {
			return date.format( format );
		}
	};