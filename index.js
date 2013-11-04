	var Schema, UNDEF,

		copy        = require( 'useful-copy' ),
		iter        = require( 'useful-iter' ),
		type        = require( 'useful-type' ),
		value       = require( 'useful-value' ),

		re_falsey   = /^false|0$/;

	function afterdefine( Schema ) {
		var Super      = Schema.__super__,
			p          = Schema.prototype,
			mappings   = p.mappings,
			properties = p.properties;

		delete p.mappings; delete p.properties;

		if ( typeof Super.__mappings__ == 'object' )
			mappings = copy.update( mappings, Super.__mappings__ );

		if ( Array.isArray( Super.__properties__ ) )
			properties = copy.update( properties, Super.__properties__ );

		Schema.__mappings__   = mappings;
		Schema.__properties__ = properties;

		Schema.extend         = extend.bind( Schema );

		return Schema;
	}

	function beforeinstance( Schema, instance, args ) {
		if ( instance.__processed__ )
			return instance;

		var config     = args[0],
			has_config = config && typeof config == 'object',
			mappings   = Schema.__mappings__,
			properties = Schema.__properties__;

		if ( has_config && Array.isArray( config ) )
			config     = { properties : config };

		if ( mappings && typeof mappings == 'object' ) {
			instance.mappings   = has_config
								? copy.update( config.mappings   || {}, mappings   )
								: copy.update( mappings   );

			!has_config || delete config.mappings;
		}

		if ( properties && typeof properties == 'object' ) {
			instance.properties = has_config
								? copy.update( config.properties || [], properties )
								: copy.update( properties );

			!has_config || delete config.properties;
		}

		return copy( instance, config );
	}

	function extend( descriptor ) {
		function Schema( config ) {
			if ( !this.__processing__ ) {
				this.__processing__ = true;

				beforeinstance( this.constructor, this, arguments );

				delete this.__processing__;

				this.__processed__  = true;
			}

			ctor.apply( this, arguments );
		}

		var ctor  = Object.prototype.hasOwnProperty.call( descriptor, 'constructor' ) ? descriptor.constructor : this,
			proto = copy( Object.create( this.prototype ), descriptor );

		proto.constructor = Schema;
		Schema.prototype  = proto;
		Schema.__super__  = this;

		return afterdefine( Schema );
	}

	function is_num( item ) {
		return typeof item == 'number' && !isNaN( item );
	}

// TODO: add exclusions?
	Schema = module.exports  = extend.call( Object, {
		constructor    : function Schema( config ) {
			this.initCoerceRoot( this.coerceRoot );
			this.initProperties( this.properties );
		},

// instance configuration properties
		coerceRoot     : null,
		mappings       : null,
		properties     : null,

// public properties
		property       : null,

// public methods
		coerce         : function( raw, loose ) {
			var data = this.prepare( raw ), i = -1, l = data.items.length;

			while ( ++i < l )
				data.items[i] = this.coerceItem( data.items[i], loose );

			return data;
		},
		coerceItem     : function( raw, loose ) {
			var data = this.createRootItem(), property;

			iter.invoke( this.properties, 'process', copy.update( this.getItemRoot( raw ) ), data );

			if ( loose === true ) {
				for ( property in raw ) {
					if ( !( property in data ) && Object.prototype.hasOwnProperty.call( raw, property ) )
						data[property] = raw[property];
				}
			}

			return data;
		},
		getItemRoot    : function( raw ) {
			var item = this.mappings.item;

			return item
				 ? value( raw, item ) || raw
				 : raw;
		},
		getRoot        : function( raw ) {
			if ( !raw ) return [];

			var items     = this.mappings.items,
				raw_items = Array.isArray( raw )
						  ? raw
						  : items
						  ? value( raw, items ) || raw
						  : raw;

			return Array.isArray( raw_items )
				 ? raw_items.slice()
				 : [];
		},
		prepare        : function( raw ) {
			var items, success = false, total = -1;

			if ( raw && typeof raw == 'object' ) {
				items   = this.getRoot( raw );

				total   = this.mappings.total   in raw
						? raw[this.mappings.total]
						: items.length;

				success = this.mappings.success in raw
						? raw[this.mappings.success]
						: !!total;
			}
			else
				items   = [];

			return {
				items   : items,
				success : success,
				total   : total
			};
		},
		toJSON         : function( data ) {
			var id, prop = this.property, val = {};

			for ( id in prop ) {
				if ( Object.prototype.hasOwnProperty.call( prop, id ) ) {
					val[id] = prop[id].toJSON( data[id] );
				}
			}

			return val;
		},
// internal methods
		addProperty    : function( property ) {
			if ( !property || typeof property !== 'object' )
				return;

			if ( !( property instanceof Property ) )
				property = new Property( property );

			this.properties.push( this.property[property.id] = property );
		},
		createRootItem : function() {
			return new this.coerceRoot();
		},
// constructor methods
		initCoerceRoot : function( Constructor ) {
			switch ( typeof Constructor ) {
				case 'function'  : break;
				case 'string'    : switch ( Constructor.toLowerCase() ) {
					case 'array' : Constructor = Array;  break;
					default      : Constructor = Object;
				} break;
				default          : Constructor = Object;
			}

			this.coerceRoot = Constructor;
		},
		initProperties : function( properties ) {
			if ( !Array.isArray( properties ) )
				throw new TypeError( 'Schema: `properties` must be an Array' );

			this.properties = [];
			this.property   = Object.create( null );

			properties.forEach( this.addProperty, this );
		}
	} );


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
//		default         : null,
//		format          : null,
		id              : null,
//		max             : null,
//		min             : null,
		schema          : null,
		store           : null,
		strict          : true,
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
		valid           : function( val ) {
			return val !== null && val !== UNDEF;
		},
		value           : function( raw, data ) {
			var val = this.transform( value( raw, this.cite ), raw, data );

			return val === this ? UNDEF : val;
		},

// internal methods
		assign          : function( val, data ) {
			if ( this.strict === true || this.valid( val ) )
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
				DATA_TYPE = Property.DATA_TYPE,
				VALID     = Property.VALIDATION;

			if ( type ) {
				switch ( typeof type ) {
					case 'string'   :
						type = type.toLowerCase();

						if ( type in DATA_TYPE ) {
							this.type = DATA_TYPE[type];

							if ( type in DEFAULTS ) {
								copy.update( this, DEFAULTS[type] );

								if ( typeof DEFAULTS[type].toJSON === 'function' )
									this.toJSON = DEFAULTS[type].toJSON;
							}

							if ( typeof VALID[type] === 'function' )
								this.valid = VALID[type];
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
			if ( this.schema )
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
			if ( this.schema )
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