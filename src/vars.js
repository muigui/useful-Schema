	var Schema, UNDEF,

		copy        = require( 'useful-copy' ),
		iter        = require( 'useful-iter' ),
		type        = require( 'useful-type' ),
		value       = require( 'useful-value' ),

		re_falsey   = /^false|0$/;