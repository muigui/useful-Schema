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
