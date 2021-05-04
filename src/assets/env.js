import toCommaDelimitedList from '@/lib/utils/toCommaDelimitedList';

const map = {
	NODE_ENV             : 'NODE_ENV',
	VUE_APP_API_PROTOCOL : 'API_PROTOCOL',
	VUE_APP_API_URL      : 'API_URL',
};

console.log( process.env );
const mapKeys = Object.keys( map );
const missing = mapKeys.filter( envKey => !process.env[envKey] );

console.log( missing, missing.map( envKey => process.env[envKey] ) );

if ( missing.length ) {
	const missingKeys = missing
		.map( key => `"${key}"` )
		.reduce( toCommaDelimitedList() );

	throw new Error( `Missing keys: ${missingKeys}` );
}

const env = mapKeys.reduce( ( obj, envKey ) => {
	const added = {};
	const key   = map[envKey];

	added[key] = process.env[envKey];

	return {
		...obj,
		...added,
	};
}, {} );

export default env;
