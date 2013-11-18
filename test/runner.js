chai     = require( 'chai' );
Schema   = require( '../index' );
expect   = chai.expect;

Schema.Date = require( '../useful-date' );
require( 'useful-date/locale/en-GB.js' );

require( './Schema.Property.test.js' );
require( './Schema.test.js' );

