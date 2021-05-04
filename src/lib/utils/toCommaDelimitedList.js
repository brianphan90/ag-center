export default ( and = 'and' ) => ( str, item, i, list ) => {
	if ( str === undefined || i === 0 ) {
		return item;
	}

	const delimiter = i === ( list.length - 1 ) ? `, ${and} ` : ', ';

	return `${str}${delimiter}${item}`;
};
