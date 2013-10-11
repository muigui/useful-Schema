
suite( 'muigui/useful-Schema', function() {
	var TestSchema = Schema.extend( {
			mappings   : { id : 'email' },
			properties : [ {
				id     : 'name',
				type   : 'string'
			}, {
				format : 'd/m/Y',
				id     : 'date',
				type   : 'date'
			}, {
				id     : 'email',
				type   : 'string'
			}, {
				cite   : 'location.city',
				id     : 'city',
				type   : 'string'
			}, {
				cite   : 'location.country',
				id     : 'country',
				type   : 'string'
			} ]
		} ),
		schema,
		test_data = {
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

	test( 'new Schema', function( done ) {
		schema = new TestSchema();

		var test_schema = new TestSchema( {
			mappings   : { id : 'id' },
			properties : [ {
				id     : 'date',
				max    : new Date( 2009, 0, 1 )
			}, {
				cite   : 'email',
				id     : 'id'
			} ]
		} );

		expect( schema.mappings.id ).to.equal( 'email' );

		schema.properties.forEach( function( property ) {
			expect( property ).to.be.an.instanceOf( Schema.Property );
		} );

		expect( test_schema.property.id ).to.exist;
		expect( test_schema.property.id.cite ).to.equal( 'email' );
		expect( test_schema.property.date.max ).to.eql( new Date( 2009, 0, 1 ) );

		done();
	} );

	test( 'Schema#coerceItem', function( done ) {
		var item = schema.coerceItem( test_data.items[0] );

		expect( item.city ).to.equal( 'North Platte' );
		expect( item.country ).to.equal( 'Guatemala' );
		expect( item.date ).to.eql( new Date( 2009, 0, 13 ) );
		expect( item.email ).to.eql( 'at.pretium@ultricies.com' );

		done();
	} );

	test( 'Schema#coerce: same `coerceRoot`', function( done ) {
		var returned = schema.coerce( test_data ),
			expected = {
				items   : [ {
					city    : "North Platte",
					country : "Guatemala",
					date    : new Date( 2009, 0, 13 ),
					email   : "at.pretium@ultricies.com",
					name    : "Baxter"
				}, {
					city    : "Pawtucket",
					country : "Somalia",
					date    : new Date( 2007, 9, 22 ),
					email   : "arcu@purusgravida.org",
					name    : "Alyssa"
				}, {
					city    : "Hidden Hills",
					country : "Myanmar",
					date    : new Date( 2008, 9, 6 ),
					email   : "vehicula@temporarcu.org",
					name    : "Fleur"
				}, {
					city    : "Ashland",
					country : "Timor-leste",
					date    : new Date( 2009, 6, 21 ),
					email   : "Vivamus@semmollis.org",
					name    : "Norman"
				}, {
					city    : "Helena",
					country : "Aruba",
					date    : new Date( 2009, 2, 26 ),
					email   : "Nulla.tempor@adipiscing.ca",
					name    : "Bryar"
				}, {
					city    : "Tampa",
					country : "Svalbard and Jan Mayen",
					date    : new Date( 2008, 6, 17 ),
					email   : "diam.vel.arcu@magnis.edu",
					name    : "Teegan"
				}, {
					city    : "Keene",
					country : "Namibia",
					date    : new Date( 2008, 4, 8 ),
					email   : "luctus.felis@eteuismodet.ca",
					name    : "Dorothy"
				}, {
					city    : "Rancho Palos Verdes",
					country : "Solomon Islands",
					date    : new Date( 2007, 10, 22 ),
					email   : "Integer@vellectusCum.edu",
					name    : "Aphrodite"
				}, {
					city    : "Shamokin",
					country : "Norway",
					date    : new Date( 2009, 2, 7 ),
					email   : "varius.ultrices.mauris@diamProindolor.edu",
					name    : "Quinn"
				}, {
					city    : "Laramie",
					country : "Norway",
					date    : new Date( 2007, 7, 5 ),
					email   : "Vestibulum@nequeNullam.org",
					name    : "Bree"
				}, {
					city    : "Lawton",
					country : "Tuvalu",
					date    : new Date( 2009, 0, 15 ),
					email   : "ultrices.sit.amet@nullamagnamalesuada.ca",
					name    : "Zahir"
				}, {
					city    : "Monrovia",
					country : "Kenya",
					date    : new Date( 2008, 6, 21 ),
					email   : "ligula.Donec@atortorNunc.org",
					name    : "Basil"
				}, {
					city    : "St. George",
					country : "Reunion",
					date    : new Date( 2007, 11, 8 ),
					email   : "Curae;.Phasellus@non.edu",
					name    : "Inez"
				}, {
					city    : "Hayward",
					country : "Central African Republic",
					date    : new Date( 2008, 4, 2 ),
					email   : "diam.lorem@malesuadautsem.ca",
					name    : "Fletcher"
				}, {
					city    : "Nenana",
					country : "Ukraine",
					date    : new Date( 2007, 8, 11 ),
					email   : "libero.mauris.aliquam@elementumloremut.org",
					name    : "Sage"
				}, {
					city    : "Eden Prairie",
					country : "Georgia",
					date    : new Date( 2008, 11, 16 ),
					email   : "Vivamus.rhoncus@etrisusQuisque.com",
					name    : "Brandon"
				}, {
					city    : "Alpharetta",
					country : "Tanzania, United Republic of",
					date    : new Date( 2009, 1, 13 ),
					email   : "Cum.sociis@sed.com",
					name    : "Miriam"
				}, {
					city    : "Frederiksted",
					country : "Australia",
					date    : new Date( 2009, 2, 11 ),
					email   : "et.magna@faucibus.ca",
					name    : "Whoopi"
				}, {
					city    : "New Haven",
					country : "Anguilla",
					date    : new Date( 2008, 3, 9 ),
					email   : "metus.vitae@Vestibulumaccumsanneque.com",
					name    : "Shay"
				}, {
					city    : "Webster Groves",
					country : "El Salvador",
					date    : new Date( 2007, 11, 13 ),
					email   : "a@cursusin.edu",
					name    : "Orson"
				} ],
				success : true,
				total   : 20
			};

		expect( returned ).to.eql( expected );

		done();
	} );

	test( 'Schema#coerce: different `coerceRoot` Object => Array', function( done ) {
		var arraySchema = new Schema( {
				coerceRoot :  Array,
				mappings   : { id : 'email' },
				properties : [ {
					cite   : 'name',
					id     :  0,
					type   : 'string'
				}, {
					cite   : 'date',
					format : 'd/m/Y',
					id     :  4,
					type   : 'date'
				}, {
					cite   : 'email',
					id     :  1,
					type   : 'string'
				}, {
					cite   : 'location.city',
					id     :  2,
					type   : 'string'
				}, {
					cite   : 'location.country',
					id     :  3,
					type   : 'string'
				} ]
			} ),
			expected    = {
				items   : [
					["Baxter", "at.pretium@ultricies.com", "North Platte", "Guatemala", new Date( 2009, 0, 13 )],
					["Alyssa", "arcu@purusgravida.org", "Pawtucket", "Somalia", new Date( 2007, 9, 22 )],
					["Fleur", "vehicula@temporarcu.org", "Hidden Hills", "Myanmar", new Date( 2008, 9, 6 )],
					["Norman", "Vivamus@semmollis.org", "Ashland", "Timor-leste", new Date( 2009, 6, 21 )],
					["Bryar", "Nulla.tempor@adipiscing.ca", "Helena", "Aruba", new Date( 2009, 2, 26 )],
					["Teegan", "diam.vel.arcu@magnis.edu", "Tampa", "Svalbard and Jan Mayen", new Date( 2008, 6, 17 )],
					["Dorothy", "luctus.felis@eteuismodet.ca", "Keene", "Namibia", new Date( 2008, 4, 8 )],
					["Aphrodite", "Integer@vellectusCum.edu", "Rancho Palos Verdes", "Solomon Islands", new Date( 2007, 10, 22 )],
					["Quinn", "varius.ultrices.mauris@diamProindolor.edu", "Shamokin", "Norway", new Date( 2009, 2, 7 )],
					["Bree", "Vestibulum@nequeNullam.org", "Laramie", "Norway", new Date( 2007, 7, 5 )],
					["Zahir", "ultrices.sit.amet@nullamagnamalesuada.ca", "Lawton", "Tuvalu", new Date( 2009, 0, 15 )],
					["Basil", "ligula.Donec@atortorNunc.org", "Monrovia", "Kenya", new Date( 2008, 6, 21 )],
					["Inez", "Curae;.Phasellus@non.edu", "St. George", "Reunion", new Date( 2007, 11, 8 )],
					["Fletcher", "diam.lorem@malesuadautsem.ca", "Hayward", "Central African Republic", new Date( 2008, 4, 2 )],
					["Sage", "libero.mauris.aliquam@elementumloremut.org", "Nenana", "Ukraine", new Date( 2007, 8, 11 )],
					["Brandon", "Vivamus.rhoncus@etrisusQuisque.com", "Eden Prairie", "Georgia", new Date( 2008, 11, 16 )],
					["Miriam", "Cum.sociis@sed.com", "Alpharetta", "Tanzania, United Republic of", new Date( 2009, 1, 13 )],
					["Whoopi", "et.magna@faucibus.ca", "Frederiksted", "Australia", new Date( 2009, 2, 11 )],
					["Shay", "metus.vitae@Vestibulumaccumsanneque.com", "New Haven", "Anguilla", new Date( 2008, 3, 9 )],
					["Orson", "a@cursusin.edu", "Webster Groves", "El Salvador", new Date( 2007, 11, 13 )]
				],
				success : true,
				total   : 20
			},
			returned    = arraySchema.coerce( test_data );

		expect( returned ).to.eql( expected );

		done();
	} );

	test( 'Schema#coerce: different `coerceRoot` Array => Object', function( done ) {
		var objectSchema    = new Schema( {
				coerceRoot :  Object,
				mappings   : { id : 1 },
				properties : [ {
					cite   :  0,
					id     : 'name',
					type   : 'string'
				}, {
					cite   :  4,
					format : 'd/m/Y',
					id     : 'date',
					type   : 'date'
				}, {
					cite   :  1,
					id     : 'email',
					type   : 'string'
				}, {
					cite   :  2,
					id     : 'location.city',
					type   : 'string'
				}, {
					cite   :  3,
					id     : 'location.country',
					type   : 'string'
				} ]
			} ),
			test_data_array = {
				items   : [
					["Baxter", "at.pretium@ultricies.com", "North Platte", "Guatemala", new Date( 2009, 0, 13 )],
					["Alyssa", "arcu@purusgravida.org", "Pawtucket", "Somalia", new Date( 2007, 9, 22 )],
					["Fleur", "vehicula@temporarcu.org", "Hidden Hills", "Myanmar", new Date( 2008, 9, 6 )],
					["Norman", "Vivamus@semmollis.org", "Ashland", "Timor-leste", new Date( 2009, 6, 21 )],
					["Bryar", "Nulla.tempor@adipiscing.ca", "Helena", "Aruba", new Date( 2009, 2, 26 )],
					["Teegan", "diam.vel.arcu@magnis.edu", "Tampa", "Svalbard and Jan Mayen", new Date( 2008, 6, 17 )],
					["Dorothy", "luctus.felis@eteuismodet.ca", "Keene", "Namibia", new Date( 2008, 4, 8 )],
					["Aphrodite", "Integer@vellectusCum.edu", "Rancho Palos Verdes", "Solomon Islands", new Date( 2007, 10, 22 )],
					["Quinn", "varius.ultrices.mauris@diamProindolor.edu", "Shamokin", "Norway", new Date( 2009, 2, 7 )],
					["Bree", "Vestibulum@nequeNullam.org", "Laramie", "Norway", new Date( 2007, 7, 5 )],
					["Zahir", "ultrices.sit.amet@nullamagnamalesuada.ca", "Lawton", "Tuvalu", new Date( 2009, 0, 15 )],
					["Basil", "ligula.Donec@atortorNunc.org", "Monrovia", "Kenya", new Date( 2008, 6, 21 )],
					["Inez", "Curae;.Phasellus@non.edu", "St. George", "Reunion", new Date( 2007, 11, 8 )],
					["Fletcher", "diam.lorem@malesuadautsem.ca", "Hayward", "Central African Republic", new Date( 2008, 4, 2 )],
					["Sage", "libero.mauris.aliquam@elementumloremut.org", "Nenana", "Ukraine", new Date( 2007, 8, 11 )],
					["Brandon", "Vivamus.rhoncus@etrisusQuisque.com", "Eden Prairie", "Georgia", new Date( 2008, 11, 16 )],
					["Miriam", "Cum.sociis@sed.com", "Alpharetta", "Tanzania, United Republic of", new Date( 2009, 1, 13 )],
					["Whoopi", "et.magna@faucibus.ca", "Frederiksted", "Australia", new Date( 2009, 2, 11 )],
					["Shay", "metus.vitae@Vestibulumaccumsanneque.com", "New Haven", "Anguilla", new Date( 2008, 3, 9 )],
					["Orson", "a@cursusin.edu", "Webster Groves", "El Salvador", new Date( 2007, 11, 13 )]
				],
				success : true,
				total   : 20
			},
			returned    = objectSchema.coerce( test_data_array );

		expect( returned.items ).to.eql( [
			{ name : 'Baxter', email : 'at.pretium@ultricies.com', location : { city : 'North Platte', country : 'Guatemala' }, date : Date.coerce( '13/01/2009', 'd/m/Y' ) },
			{ name : 'Alyssa', email : 'arcu@purusgravida.org', location : { city : 'Pawtucket', country : 'Somalia' }, date : Date.coerce( '22/10/2007', 'd/m/Y' ) },
			{ name : 'Fleur',  email : 'vehicula@temporarcu.org', location : { city : 'Hidden Hills', country : 'Myanmar' }, date : Date.coerce( '06/10/2008', 'd/m/Y' ) },
			{ name : 'Norman', email : 'Vivamus@semmollis.org', location : { city : 'Ashland', country : 'Timor-leste' }, date : Date.coerce( '21/07/2009', 'd/m/Y' ) },
			{ name : 'Bryar', email : 'Nulla.tempor@adipiscing.ca', location : { city : 'Helena', country : 'Aruba' }, date : Date.coerce( '26/03/2009', 'd/m/Y' ) },
			{ name : 'Teegan', email : 'diam.vel.arcu@magnis.edu', location : { city : 'Tampa', country : 'Svalbard and Jan Mayen' }, date : Date.coerce( '17/07/2008', 'd/m/Y' ) },
			{ name : 'Dorothy', email : 'luctus.felis@eteuismodet.ca', location : { city : 'Keene', country : 'Namibia' }, date : Date.coerce( '08/05/2008', 'd/m/Y' ) },
			{ name : 'Aphrodite', email : 'Integer@vellectusCum.edu', location : { city : 'Rancho Palos Verdes', country : 'Solomon Islands' }, date : Date.coerce( '22/11/2007', 'd/m/Y' ) },
			{ name : 'Quinn', email : 'varius.ultrices.mauris@diamProindolor.edu', location : { city : 'Shamokin', country : 'Norway' }, date : Date.coerce( '07/03/2009', 'd/m/Y' ) },
			{ name : 'Bree', email : 'Vestibulum@nequeNullam.org', location : { city : 'Laramie', country : 'Norway' }, date : Date.coerce( '05/08/2007', 'd/m/Y' ) },
			{ name : 'Zahir', email : 'ultrices.sit.amet@nullamagnamalesuada.ca', location : { city : 'Lawton', country : 'Tuvalu' }, date : Date.coerce( '15/01/2009', 'd/m/Y' ) },
			{ name : 'Basil', email : 'ligula.Donec@atortorNunc.org', location : { city : 'Monrovia', country : 'Kenya' }, date : Date.coerce( '21/07/2008', 'd/m/Y' ) },
			{ name : 'Inez', email : 'Curae;.Phasellus@non.edu', location : { city : 'St. George', country : 'Reunion' }, date : Date.coerce( '08/12/2007', 'd/m/Y' ) },
			{ name : 'Fletcher', email : 'diam.lorem@malesuadautsem.ca', location : { city : 'Hayward', country : 'Central African Republic' }, date : Date.coerce( '02/05/2008', 'd/m/Y' ) },
			{ name : 'Sage', email : 'libero.mauris.aliquam@elementumloremut.org', location : { city : 'Nenana', country : 'Ukraine' }, date : Date.coerce( '11/09/2007', 'd/m/Y' ) },
			{ name : 'Brandon', email : 'Vivamus.rhoncus@etrisusQuisque.com', location : { city : 'Eden Prairie', country : 'Georgia' }, date : Date.coerce( '16/12/2008', 'd/m/Y' ) },
			{ name : 'Miriam', email : 'Cum.sociis@sed.com', location : { city : 'Alpharetta', country : 'Tanzania, United Republic of' }, date : Date.coerce( '13/02/2009', 'd/m/Y' ) },
			{ name : 'Whoopi', email : 'et.magna@faucibus.ca', location : { city : 'Frederiksted', country : 'Australia' }, date : Date.coerce( '11/03/2009', 'd/m/Y' ) },
			{ name : 'Shay', email : 'metus.vitae@Vestibulumaccumsanneque.com', location : { city : 'New Haven', country : 'Anguilla' }, date : Date.coerce( '09/04/2008', 'd/m/Y' ) },
			{ name : 'Orson', email : 'a@cursusin.edu', location : { city : 'Webster Groves', country : 'El Salvador' }, date : Date.coerce( '13/12/2007', 'd/m/Y' ) }
		] );

		done();
	} );

	test( 'Schema#getItemRoot', function( done ) {
		var LocationSchema = new Schema( {
				mappings   : { item : 'location' },
				properties : [ {
					id     : 'city',
					type   : 'string'
				}, {
					id     : 'country',
					type   : 'string'
				} ]
			} ),
			expected       = {
				items      : [
					{ city : 'North Platte', country : 'Guatemala' },
					{ city : 'Pawtucket', country : 'Somalia' },
					{ city : 'Hidden Hills', country : 'Myanmar' },
					{ city : 'Ashland', country : 'Timor-leste' },
					{ city : 'Helena', country : 'Aruba' },
					{ city : 'Tampa', country : 'Svalbard and Jan Mayen' },
					{ city : 'Keene', country : 'Namibia' },
					{ city : 'Rancho Palos Verdes', country : 'Solomon Islands' },
					{ city : 'Shamokin', country : 'Norway' },
					{ city : 'Laramie', country : 'Norway' },
					{ city : 'Lawton', country : 'Tuvalu' },
					{ city : 'Monrovia', country : 'Kenya' },
					{ city : 'St. George', country : 'Reunion' },
					{ city : 'Hayward', country : 'Central African Republic' },
					{ city : 'Nenana', country : 'Ukraine' },
					{ city : 'Eden Prairie', country : 'Georgia' },
					{ city : 'Alpharetta', country : 'Tanzania, United Republic of' },
					{ city : 'Frederiksted', country : 'Australia' },
					{ city : 'New Haven', country : 'Anguilla' },
					{ city : 'Webster Groves', country : 'El Salvador' }
				],
				success    : true,
				total      : 20
			},
			returned       = LocationSchema.coerce( test_data );

		expect( returned.items ).to.eql( expected.items );

		done();
	} );
} );
