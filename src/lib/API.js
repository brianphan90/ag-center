import env from '@/assets/env';
// eslint-disable-next-line import/no-cycle
import store from '../store';

const path = ( a, queryOptions = null ) => {
	const query = ( () => {
		if ( !queryOptions ) {
			return '';
		}

		const queryKeys   = Object.keys( queryOptions );
		const queryString = queryKeys
			.map( ( key ) => {

				const value = queryOptions[key];
				if ( typeof value !== 'object' ) {
					return `${key}=${encodeURIComponent( queryOptions[key] )}`;
				}

				return encodeArray( key, value );
			} )
			.filter( q => q.length )
			.join( '&' );

		return `?${queryString}`;
	} )();

	return `${env.API_PROTOCOL}://${env.API_URL}/${a}${query}`;
};

const encodeArray = ( key, arr ) => { // eslint-disable-line

	return arr.reduce( ( a, item, i ) => {

		// For 1 dimensional arrays
		if ( !Array.isArray( item ) ) {
			a.push( `${key}[${i}]=${encodeURIComponent( item )}` );
			return a;
		}

		// For 2 dimensional arrays
		item.forEach( ( x, j ) => {
			if ( typeof x === 'object' ) {
				const objKeys = Object.keys( x );
				objKeys.forEach( ( objKey ) => {
					a.push( `${key}[${i}][${j}][${objKey}]=${encodeURIComponent( x[objKey] )}` );
				} );

				return;
			}
			a.push( `${key}[${i}][${j}]=${encodeURIComponent( x )}` );
		} );

		return a;

	}, [] )
		.join( '&' );
};


const fetchPromise = ( route, options ) => new Promise( async ( resolve, reject ) => {
	try {
		await fetch( route, options )
			.then( async ( res ) => {
				const status = parseInt( res.status, 10 );

				if ( ( Math.floor( status / 100 ) * 100 ) !== 200 ) {

					res.json()
						.then( err => reject( err ) );

					return;
				}

				const body = await _body( res );
				resolve( body, res );
			} );
	}
	catch ( e ) {
		reject( e );
	}
} );

const _body = async ( res ) => {
	const text = await res.text();

	const firstChar = text.charAt( 0 );
	const isJson    = ( firstChar === '{' || firstChar === '[' );

	if ( isJson ) {
		return JSON.parse( text );
	}

	return text;
};

const authenticate = method => async ( ...args ) => { // eslint-disable-line
	const authObject = {
		defaultHeaders : await new Headers( {
			'Content-Type' : 'application/json',
			'Auth-Token'   : store.state.accessToken
		} ),
	};
	const allArgs = [authObject].concat( args );

	return method( ...allArgs );
};

export const RefreshToken =  () => fetchPromise( path( 'auth/refresh-token' ), {
	method      : 'GET',
	credentials : 'include',
	headers     : new Headers( {
		'Content-Type' : 'application/json',
	} ),
} );

export const SetLogout = () => fetchPromise( path( 'auth/logout' ), {
	method      : 'GET',
	credentials : 'include',
	headers     : new Headers( {
		'Content-Type' : 'applicaiton/json',
	} ),
} );

export const Login = credentials => fetchPromise( path( 'auth/login' ), {
	method      : 'POST',
	credentials : 'include',
	headers     : new Headers( {
		'Content-Type' : 'application/json',
	} ),
	body : JSON.stringify( { credentials } )
} );


export const GetManifests = authenticate( async ( _auth, contractNum ) => fetchPromise( path( `contract/manifests/${contractNum}` ), {
	method  : 'GET',
	headers : _auth.defaultHeaders
} ) );

export const GetSummaryTable = authenticate( ( _auth, rttNums ) => fetchPromise( path( 'contract/summary-tables', {
	rttNums
} ), {
	method      : 'GET',
	credentials : 'include',
	headers     : _auth.defaultHeaders
} ) );

export const GetContractList = authenticate( _auth => fetchPromise( path( 'contract/list' ), {
	method      : 'GET',
	credentials : 'include',
	headers     : _auth.defaultHeaders
} ) );

// here are the sprocs being used for Entity Summary


// export const GetTotalPoundsProducedAllYears = args => authenticate( _auth => fetchPromise( path( 'GDD/getTotalPoundsProducedAllYears' ), {
// 	method  : 'GET',
// 	args    : 'include',
// 	headers : _auth.defaultHeaders,
// 	body    : JSON.stringify( { args } )
// } ) );


export const GetTotalPoundsProducedAllYears = args => fetchPromise( path( 'GDD/getTotalPoundsProducedAllYears', { ContractNum : args } ), {
	method      : 'GET',
	credentials : 'include',
	headers     : new Headers( {
		'Content-Type' : 'application/json',
	} ),
} );

export const InsectSproc = args => fetchPromise( path( 'GDD/insectSproc', { ContractNum : args.ContractNum, CropYear : args.CropYear } ), {
	method  : 'GET',
	args    : 'include',
	headers : new Headers( {
		'Content-Type' : 'application/json',
	} ),
} );

export const InsectSprocAllYears = args => fetchPromise( path( 'GDD/getInsectSprocAllYears', { ContractNum : args } ), {
	method  : 'GET',
	args    : 'include',
	headers : new Headers( {
		'Content-Type' : 'application/json',
	} ),
} );


export const QualitySproc = args => fetchPromise( path( 'GDD/qualitySproc', { ContractNum : args.ContractNum, CropYear : args.CropYear } ), {
	method  : 'GET',
	args    : 'include',
	headers : new Headers( {
		'Content-Type' : 'application/json',
	} ),
} );

export const QualitySprocAllYears = args => fetchPromise( path( 'GDD/getQualitySprocAllYears', { ContractNum : args } ), {
	method  : 'GET',
	args    : 'include',
	headers : new Headers( {
		'Content-Type' : 'application/json',
	} ),
} );

export const YieldByVarietySproc = args => fetchPromise( path( 'GDD/yieldByVarietySproc', { ContractNum : args.ContractNum, CropYear : args.CropYear } ), {
	method  : 'GET',
	args    : 'include',
	headers : new Headers( {
		'Content-Type' : 'application/json',
	} ),
} );

export const YieldByVarietySprocAllYears = args => fetchPromise( path( 'GDD/yieldByVarietySprocAllYears', { ContractNum : args } ), {
	method  : 'GET',
	args    : 'include',
	headers : new Headers( {
		'Content-Type' : 'application/json',
	} ),


} );

export const QualityByFieldSprocAllYears = args => fetchPromise( path( 'GDD/qualityByFieldSprocAllYears', { ContractNum : args } ), {
	method  : 'GET',
	args    : 'include',
	headers : new Headers( {
		'Content-Type' : 'application/json',
	} ),
} );

export const InsectByFieldSprocAllYears = args => fetchPromise( path( 'GDD/insectByFieldSprocAllYears', { ContractNum : args } ), {
	method  : 'GET',
	args    : 'include',
	headers : new Headers( {
		'Content-Type' : 'application/json',
	} ),
} );

export const QualityByVarietySprocAllYears = args => fetchPromise( path( 'GDD/qualityByVarietyAllYears', { ContractNum : args } ), {
	method  : 'GET',
	args    : 'include',
	headers : new Headers( {
		'Content-Type' : 'application/json',
	} ),
} );
export const InsectByVarietySprocAllYears = args => fetchPromise( path( 'GDD/insectByVarietySprocAllYears', { ContractNum : args } ), {
	method  : 'GET',
	args    : 'include',
	headers : new Headers( {
		'Content-Type' : 'application/json',
	} ),
} );
