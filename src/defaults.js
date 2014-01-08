	Schema.__mappings__    = {
		id      : 'id',
		item    :  null,
		items   : 'items',
		success : 'success',
		total   : 'total'
	};

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

	Property.DATA_TYPE     = { // todo: these may need a lil' more work
		array      : function( v ) {
			if ( this.strict && this.schema )
				return this.schema.coerce( v ).items || [];

			if ( v === null || v === UNDEF )
				v = Array.isArray( this.default ) ? copy.merge( [], this.default ) : [];
			else if ( Array.isArray( v ) || ( typeof v == 'object' && 'length' in v ) )
				v = Array.prototype.slice.call( v );
			else
				v = [v];

			v = Array.isArray( v ) ? v : value.exists( v ) ? Array.prototype.slice.call( v ) : [];

			if ( is_num( this.max ) && v.length > this.max )
				v.length = this.max;

			return v;
		},
		boolean    : function( v ) {
			if ( v === null || v === UNDEF )
				return typeof this.default == 'boolean' ? this.default : false;

			if ( typeof v != 'boolean' )
				v = re_falsey.test( v ) ? false : typeof this.default == 'boolean' ? this.default : !!v;

			return v;
		},
		date       : function( v, format ) {
			var date = is_num( v ) ? new Date( v ) : v,
				max  = +this.max,
				min  = +this.min;

			if ( type.native( v ) != 'date' ) {
				if ( !format )
					format = this.format;

				if ( v === null || v === UNDEF )
					date   = NaN;
				else
					switch ( typeof format ) {
						case 'string'   : date = Schema.Date.coerce( v, format ); break;
						case 'function' : date = format( v );                     break;
						default         : date = new Date( v );
					}
			}

			date  = !is_num( +date ) ? this.default == 'now' ? new Date() : new Date( +this.default ) : date;
			v = +date;

			if ( min && is_num( min ) && v < min )
				date = Schema.Date.clone( this.min );

			if ( max && is_num( max ) && v > max )
				date = Schema.Date.clone( this.max );

			return date;
		},
		number     : function( v ) {
			v   = Number( v ) == v ? Number( v ) : this.default;

			var max = this.max,
				min = this.min;

			if ( is_num( min ) && v < min )
				v = +min;

			if ( is_num( max ) && v > max )
				v = +max;

			return v;
		},
		object     : function( v ) {
			if ( this.schema && v && typeof v === 'object' )
				return this.schema.coerceItem( v );

			return v === UNDEF ? this.default : v;
		},
		string     : function( v ) {
			v = String( v ) == v ? String( v ) : this.default;

			if ( is_num( this.max ) && v.length > this.max )
				v = v.substring( 0, this.max );

			return v;
		}
	};

	Object.keys( Property.DATA_TYPE ).forEach( function( type ) {
		this[type].id = type;
	}, Property.DATA_TYPE );

	Property.FORMAT_AS     = {
		DEFAULT    : function( property, val ) {
			return property.type( val );
		},
		FUNCTION   : function( property, val, format, raw, data ) {
			return property.type( format.call( property, val, raw, data ) );
		},
		STRING     : function( property, val, format ) {
			return property.type( val, format );
		}
	};

	Property.TYPE_DEFAULTS = {
		array       : {
			min     : 0,
			max     : Math.pow( 2, 32 ) - 1,
			toJSON  : function( v ) {
				return JSON.stringify( v );
			}
		},
		boolean     : { default : false },
		date        : {
			default : 'now',
			format  : 'U',
			toJSON  : function( v ) {
				return v instanceof Date
					 ? Schema.Date.format( v, this.format )
					 : v;
			}
		},
		object      : {
			toJSON  : function( v ) {
				return JSON.stringify( v );
			}
		},
		number      : {
			default : NaN,
			max     : Number.POSITIVE_INFINITY,
			min     : Number.NEGATIVE_INFINITY
		},
		string      : { default : '' }
	};

	Property.VALIDATION = {
		array   : function( val ) {
			return Object.prototype.toString.call( val ) === '[object Array]' && val.length;
		},
		boolean : function( val ) {
			return typeof val === 'boolean';
		},
		date    : function( val ) {
			return Object.prototype.toString.call( val ) === '[object Date]' && !isNaN( +val );
		},
		number  : function( val ) {
			return typeof val === 'number' && !isNaN( val );
		},
		string  : function( val ) {
			return typeof val === 'string';
		}
	};