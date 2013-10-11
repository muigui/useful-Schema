	function Property( config ) {
		copy( this, config || {} );

		this.init();

		this.initType( this.type );

		this.initFormat( this.format );
	}

	Schema.Property    = Property;

	Property.prototype = {
		constructor     : Property,

// instance configuration properties
		cite            : null,
		default         : null,
		format          : null,
		id              : null,
		max             : null,
		min             : null,
		schema          : null,
		store           : null,
		type            : 'object',

// public properties

// internal properties
		applyFormat     : null,
		re_collection   : /([^\[]+)\[\]$/,

// public methods
		coerce          : function( val, raw, data ) {
			return this.applyFormat( this, val, this.format, raw, data );
		},
		process         : function( raw, data ) {
			var raw_value = this.value( raw, data ),
				val       = this.coerce( raw_value, raw, data );

			return this.assign( val, data );
		},
		toJSON          : function( val ) {
			return val;
		},
		transform       : function( val, raw, data ) {
			return val;
		},
		value           : function( raw, data ) {
			var val = this.transform( value( raw, this.cite ), raw, data );

			return val === this ? UNDEF : val;
		},

// internal methods
		assign          : function( val, data ) {
			value.assign( data, this.id, val );

			return data;
		},

// constructor methods
		init            : function() {
			if ( !value.exists( this.cite ) && this.id )
				this.cite = this.id;
			if ( !value.exists( this.id ) && this.cite )
				this.id = this.cite;
		},
		initFormat      : function( format ) {
			var format_type = type.native( format ).toUpperCase();

			this.applyFormat = Property.FORMAT_AS[format_type] || Property.FORMAT_AS.DEFAULT;
		},
		initType        : function( type ) {
			var DEFAULTS  = Property.TYPE_DEFAULTS,
				DATA_TYPE = Property.DATA_TYPE;

			if ( type ) {
				switch ( typeof type ) {
					case 'string'   :
						type = type.toLowerCase();

						if ( type in DATA_TYPE ) {
							this.type = DATA_TYPE[type];

							if ( type in DEFAULTS )
								copy.merge( this, DEFAULTS[type] );
						}

						break;
					case 'function' :
						this.type = type;

						break;

				}
			}

			if ( typeof this.type != 'function' )
				throw new TypeError( 'Schema.Property', 'Invalid `type` specified.' );
		}
	};