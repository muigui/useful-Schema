
suite( 'muigui/useful-Schema.Property', function() {
	var test_data = {
			items   : [
				{ name : 'Baxter', email : 'at.pretium@ultricies.com', location : { city : 'North Platte', country : 'Guatemala' }, date : '13/01/2009', age : 10 },
				{ name : 'Alyssa', email : 'arcu@purusgravida.org', location : { city : 'Pawtucket', country : 'Somalia' }, date : '22/10/2007', age : 15 },
				{ name : 'Fleur',  email : 'vehicula@temporarcu.org', location : { city : 'Hidden Hills', country : 'Myanmar' }, date : '06/10/2008', age : 20 },
				{ name : 'Norman', email : 'Vivamus@semmollis.org', location : { city : 'Ashland', country : 'Timor-leste' }, date : '21/07/2009', age : 25 },
				{ name : 'Bryar', email : 'Nulla.tempor@adipiscing.ca', location : { city : 'Helena', country : 'Aruba' }, date : '26/03/2009', age : 35 },
				{ name : 'Teegan', email : 'diam.vel.arcu@magnis.edu', location : { city : 'Tampa', country : 'Svalbard and Jan Mayen' }, date : '17/07/2008', age : 45 },
				{ name : 'Dorothy', email : 'luctus.felis@eteuismodet.ca', location : { city : 'Keene', country : 'Namibia' }, date : '08/05/2008', age : 50 },
				{ name : 'Aphrodite', email : 'Integer@vellectusCum.edu', location : { city : 'Rancho Palos Verdes', country : 'Solomon Islands' }, date : '22/11/2007', age : 55 },
				{ name : 'Quinn', email : 'varius.ultrices.mauris@diamProindolor.edu', location : { city : 'Shamokin', country : 'Norway' }, date : '07/03/2009', age : 60 },
				{ name : 'Bree', email : 'Vestibulum@nequeNullam.org', location : { city : 'Laramie', country : 'Norway' }, date : '05/08/2007', age : 65 },
				{ name : 'Zahir', email : 'ultrices.sit.amet@nullamagnamalesuada.ca', location : { city : 'Lawton', country : 'Tuvalu' }, date : '15/01/2009', age : 70 },
				{ name : 'Basil', email : 'ligula.Donec@atortorNunc.org', location : { city : 'Monrovia', country : 'Kenya' }, date : '21/07/2008', age : 75 },
				{ name : 'Inez', email : 'Curae;.Phasellus@non.edu', location : { city : 'St. George', country : 'Reunion' }, date : '08/12/2007', age : 80 },
				{ name : 'Fletcher', email : 'diam.lorem@malesuadautsem.ca', location : { city : 'Hayward', country : 'Central African Republic' }, date : '02/05/2008', age : 20 },
				{ name : 'Sage', email : 'libero.mauris.aliquam@elementumloremut.org', location : { city : 'Nenana', country : 'Ukraine' }, date : '11/09/2007', age : 25 },
				{ name : 'Brandon', email : 'Vivamus.rhoncus@etrisusQuisque.com', location : { city : 'Eden Prairie', country : 'Georgia' }, date : '16/12/2008', age : 25 },
				{ name : 'Miriam', email : 'Cum.sociis@sed.com', location : { city : 'Alpharetta', country : 'Tanzania, United Republic of' }, date : '13/02/2009', age : 20 },
				{ name : 'Whoopi', email : 'et.magna@faucibus.ca', location : { city : 'Frederiksted', country : 'Australia' }, date : '11/03/2009', age : 20 },
				{ name : 'Shay', email : 'metus.vitae@Vestibulumaccumsanneque.com', location : { city : 'New Haven', country : 'Anguilla' }, date : '09/04/2008', age : 20 },
				{ name : 'Orson', email : 'a@cursusin.edu', location : { city : 'Webster Groves', country : 'El Salvador' }, date : '13/12/2007', age : 25 }
			],
			success : true,
			total   : 20
		};

	suite( 'type: object', function() {
		var property_cite, property_direct;

		test( 'new Schema.Property', function( done ) {
				property_direct = new Schema.Property( {
					id   : 'name',
					type : 'object'
				} );
				property_cite   = new Schema.Property( {
					cite : 'location.country',
					id   : 'country'
				} );

			expect( property_direct.type ).to.be.an( 'function' );
			expect( property_cite.type ).to.be.an( 'function' );

			done();
		} );

		test( 'Property#coerce', function( done ) {
			var returned = {};

			expect( property_direct.coerce( test_data.items[0].name, test_data.items[0], returned ) ).to.equal( 'Baxter' );
			expect( property_cite.coerce( test_data.items[0].location.country, test_data.items[0], returned ) ).to.equal( 'Guatemala' );

			done();
		} );

		test( 'Property#process', function( done ) {
			var expected = { name : 'Baxter', country : 'Guatemala' },
				returned = {};

			property_direct.process( test_data.items[0], returned );
			property_cite.process( test_data.items[0], returned );

			expect( returned ).to.eql( expected );

			done();
		} );

		test( 'Property#value', function( done ) {
			var returned = {};

			expect( property_direct.value( test_data.items[0], returned ) ).to.equal( 'Baxter' );
			expect( property_cite.value( test_data.items[0], returned ) ).to.equal( 'Guatemala' );

			done();
		} );

		test( 'creating a property with a custom format Function', function( done ) {
			var property = new Schema.Property( {
					format : function( value, raw, data ) {
						expect( value ).to.equal( 'at.pretium@ultricies.com' );
						expect( raw ).to.equal( test_data.items[0] );
						expect( data ).to.equal( returned );

						return 'EMAIL: ' + value;
					},
					id     : 'email'
				} ),
				returned = {};

			property.process( test_data.items[0], returned );

			expect( returned.email ).to.equal( 'EMAIL: at.pretium@ultricies.com' );

			done();
		} );

		test( 'TODO: coerce using Schema', function( done ) {
			done();
		} );
	} );

	suite( 'type: array', function() {
		var property_cite, property_direct;

		test( 'new Schema.Property', function( done ) {
				property_direct = new Schema.Property( {
					id   : 'items',
					type : 'array'
				} );
				property_cite   = new Schema.Property( {
					cite : 'items',
					id   : 'users',
					type : 'array'
				} );

			expect( property_direct.type ).to.equal( Schema.Property.DATA_TYPE.array );
			expect( property_cite.type ).to.equal( Schema.Property.DATA_TYPE.array );

			done();
		} );

		test( 'Property#coerce', function( done ) {
			var returned = {};

			expect( property_direct.coerce( test_data.items, test_data, returned ) ).to.be.a( 'array' );
			expect( property_direct.coerce( test_data.items, test_data, returned ) ).to.eql( test_data.items );
			expect( property_direct.coerce( test_data.items, test_data, returned ) ).to.not.equal( test_data.items );
			expect( property_direct.coerce( 'foo', { items : 'foo' }, returned ) ).to.be.eql( ['foo'] );
			expect( property_direct.coerce( null, { items : null }, returned ) ).to.be.eql( [] );

			done();
		} );

		test( 'Property#process', function( done ) {
			var returned = {};
			property_direct.process( test_data, returned );

			expect( returned.items ).to.be.a( 'array' );
			expect( returned.items ).to.eql( test_data.items );
			expect( returned.items ).to.not.equal( test_data.items );

			returned = {};
			property_direct.process( { items : 'foo' }, returned );

			expect( returned.items ).to.be.eql( ['foo'] );

			returned = {};
			property_direct.process( { items : null }, returned );

			expect( returned.items ).to.be.eql( [] );

			returned = {};
			property_cite.process( test_data, returned );

			expect( returned.users ).to.be.a( 'array' );
			expect( returned.users ).to.eql( test_data.items );
			expect( returned.users ).to.not.equal( test_data.items );

			returned = {};
			property_cite.process( { items : 'foo' }, returned );

			expect( returned.users ).to.be.eql( ['foo'] );

			returned = {};
			property_cite.process( { items : null }, returned );

			expect( returned.users ).to.be.eql( [] );

			done();
		} );

		test( 'Property#value', function( done ) {
			var returned = {};

			expect( property_direct.value( test_data, returned ) ).to.equal( test_data.items );
			expect( property_cite.value( test_data, returned ) ).to.equal( test_data.items );

			done();
		} );

		test( 'creating a property with a custom format Function', function( done ) {
			var property = new Schema.Property( {
					format : function( value, raw, data ) {
						expect( value ).to.eql( test_data.items );
						expect( raw ).to.equal( test_data );
						expect( data ).to.equal( returned );

						return [1, 2, 3];
					},
					id     : 'items',
					type   : 'array'
				} ),
				returned = {};

				property.process( test_data, returned );

				expect( returned.items ).to.eql( [1, 2, 3] );

				done();
		} );

		test( 'max length', function( done ) {
			var property = new Schema.Property( {
					id   : 'items',
					max  :  10,
					type : 'array'
				} ),
				returned = {};

			property.process( test_data, returned );

			expect( returned.items.length ).to.equal( 10 );
			expect( returned.items ).to.eql( test_data.items.slice( 0, 10 ) );

			done();
		} );

		test( 'TODO: coerce using Schema', function( done ) {
			done();
		} );
	} );

	suite( 'type: boolean', function() {
		var property;

		test( 'new Schema.Property', function( done ) {
			property = new Schema.Property( {
				default : true,
				id      : 'flagged',
				type    : 'boolean'
			} );

			expect( property.type ).to.equal( Schema.Property.DATA_TYPE.boolean );
			expect( property.default ).to.equal( true );

			done();
		} );

		test( 'Property#coerce', function( done ) {
			var items    = [
					{ flagged : true }, { flagged : false }, { flagged : 1 }, { flagged : 0 },
					{ flagged : '0' }, { flagged : 'false' }, { flagged : null }, { flagged : undefined },
					{ flagged : 'null' }, { flagged : 'undefined' }
				],
				returned = {};

			items.forEach( function( item, i ) {

				expect( property.coerce( item.flagged, items, returned ) ).to.equal( this[i] );

			}, [true, false, true, false, false, false, true, true, true, true] );

			done();
		} );

		test( 'Property#process', function( done ) {
			var items    = [
					{ flagged : true }, { flagged : false }, { flagged : 1 }, { flagged : 0 },
					{ flagged : '0' }, { flagged : 'false' }, { flagged : null }, { flagged : undefined },
					{ flagged : 'null' }, { flagged : 'undefined' }
				];

			items.forEach( function( item, i ) {
				var returned = {};

				property.process( item, returned );

				expect( returned.flagged ).to.equal( this[i] );

			}, [true, false, true, false, false, false, true, true, true, true] );

			done();
		} );

		test( 'Property#value', function( done ) {
			var items    = [
					{ flagged : true }, { flagged : false }, { flagged : 1 }, { flagged : 0 },
					{ flagged : '0' }, { flagged : 'false' }, { flagged : null }, { flagged : undefined },
					{ flagged : 'null' }, { flagged : 'undefined' }
				];

			items.forEach( function( item, i ) {
				var returned = {};

				expect( property.value( item, returned ) ).to.equal( items[i].flagged );

			} );

			done();
		} );

		test( 'creating a property with a custom format Function', function( done ) {
			var property = new Schema.Property( {
					default : true,
					format  : function( value, raw, data ) {
						return typeof value == 'string' && /^false|0|null|undefined$/.test( value )
							 ? false
							 : !!value;
					},
					id      : 'flagged',
					type    : 'boolean'
				} ),
				items    = [
					{ flagged : true }, { flagged : false }, { flagged : 1 }, { flagged : 0 },
					{ flagged : '0' }, { flagged : 'false' }, { flagged : null }, { flagged : undefined },
					{ flagged : 'null' }, { flagged : 'undefined' }
				];


			items.forEach( function( item, i ) {
				var returned = {};

				expect( property.coerce( item.flagged, item, returned ) ).to.equal( this[i] );

			}, [true, false, true, false, false, false, false, false, false, false] );

			done();
		} );
	} );

	suite( 'type: number', function() {
		var property;

		test( 'new Schema.Property', function( done ) {
			property = new Schema.Property( {
				min  : 20,
				max  : 55,
				id   : 'age',
				type : 'number'
			} );

			expect( property.type ).to.equal( Schema.Property.DATA_TYPE.number );
			expect( property.max ).to.equal( 55 );
			expect( property.min ).to.equal( 20 );

			done();
		} );

		test( 'Property#coerce', function( done ) {
			var returned = {};

			expect( property.coerce( test_data.items[0].age, test_data.items[0], returned ) ).to.equal( 20 );
			expect( property.coerce( test_data.items[4].age, test_data.items[4], returned ) ).to.equal( 35 );

			done();
		} );

		test( 'Property#process', function( done ) {
			var returned = {};

			property.process( test_data.items[0], returned );

			expect( returned.age ).to.equal( 20 );

			returned = {};
			property.process( test_data.items[4], returned );

			expect( returned.age ).to.equal( 35 );

			done();
		} );

		test( 'Property#value', function( done ) {
			var returned = {};

			expect( property.value( test_data.items[0], returned ) ).to.equal( 10 );
			expect( property.value( test_data.items[4], returned ) ).to.equal( 35 );

			done();
		} );

		test( 'creating a property with a custom format Function', function( done ) {
			var property = new Schema.Property( {
					format : function( value, raw, data ) {
						return value + 15;
					},
					id     : 'age',
					min    : 20,
					max    : 55,
					type   : 'number'
				} ),
				returned = {};

			property.process( test_data.items[0], returned );

			expect( returned.age ).to.equal( 25 );

			returned = {};
			property.process( test_data.items[4], returned );

			expect( returned.age ).to.equal( 50 );

			done();
		} );
	} );

	suite( 'type: string', function() {
		var property;

		test( 'new Schema.Property', function( done ) {
			property = new Schema.Property( {
				min  : 20,
				max  : 55,
				id   : 'age',
				type : 'number'
			} );

			expect( property.type ).to.equal( Schema.Property.DATA_TYPE.number );
			expect( property.max ).to.equal( 55 );
			expect( property.min ).to.equal( 20 );

			done();
		} );

		test( 'Property#coerce', function( done ) {
			var returned = {};

			expect( property.coerce( test_data.items[0].age, test_data.items[0], returned ) ).to.equal( 20 );
			expect( property.coerce( test_data.items[4].age, test_data.items[4], returned ) ).to.equal( 35 );

			done();
		} );

		test( 'Property#process', function( done ) {
			var returned = {};

			property.process( test_data.items[0], returned );

			expect( returned.age ).to.equal( 20 );

			returned = {};
			property.process( test_data.items[4], returned );

			expect( returned.age ).to.equal( 35 );

			done();
		} );

		test( 'Property#value', function( done ) {
			var returned = {};

			expect( property.value( test_data.items[0], returned ) ).to.equal( 10 );
			expect( property.value( test_data.items[4], returned ) ).to.equal( 35 );

			done();
		} );

		test( 'creating a property with a custom format', function( done ) {
			var property = new Schema.Property( {
					format : function( value, raw, data ) {
						return value + 15;
					},
					id     : 'age',
					min    : 20,
					max    : 55,
					type   : 'number'
				} ),
				returned = {};

			property.process( test_data.items[0], returned );

			expect( returned.age ).to.equal( 25 );

			returned = {};
			property.process( test_data.items[4], returned );

			expect( returned.age ).to.equal( 50 );

			done();
		} );
	} );

	suite( 'type: date', function() {
		var property;

		test( 'new Schema.Property', function( done ) {
			property = new Schema.Property( {
				format : 'd/m/Y',
				id     : 'date',
				max    : new Date( 2009, 4, 1 ),
				min    : new Date( 2008, 0, 1 ),
				type   : 'date'
			} );

			expect( property.type ).to.equal( Schema.Property.DATA_TYPE.date );
			expect( +property.max ).to.equal( +( new Date( 2009, 4, 1 ) ) );
			expect( +property.min ).to.equal( +( new Date( 2008, 0, 1 ) ) );

			done();
		} );

		test( 'Property#coerce', function( done ) {
			var returned = {};

			expect( property.coerce( test_data.items[0].date, test_data.items[0], returned ) ).to.eql( new Date( 2009, 0, 13 ) );
			expect( property.coerce( test_data.items[3].date, test_data.items[3], returned ) ).to.eql( new Date( 2009, 4, 1 ) );

			done();
		} );

		test( 'Property#process', function( done ) {
			var returned = {};

			property.process( test_data.items[0], returned );

			expect( returned.date ).to.eql( new Date( 2009, 0, 13 ) );

			returned = {};
			property.process( test_data.items[3], returned );

			expect( returned.date ).to.eql( new Date( 2009, 4, 1 ) );

			done();
		} );

		test( 'Property#value', function( done ) {
			var returned = {};

			expect( property.value( test_data.items[0], returned ) ).to.equal( '13/01/2009' );
			expect( property.value( test_data.items[3], returned ) ).to.equal( '21/07/2009' );

			done();
		} );
	} );
} );
