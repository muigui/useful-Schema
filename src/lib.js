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
			if ( has_config ) { 
				if ( Array.isArray( config.properties ) )
					config.overwrites = properties;
				else
					delete config.properties;
			}
			else
				instance.properties = copy.update( properties );
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