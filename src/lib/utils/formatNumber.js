export default ( num, pre = '' ) => {
	const cutPoints = [
		'',
		'K',
		'M',
		'B'
	];

	const postCharIndex = cutPoints.reduce( ( selectedIndex, cutPoint, i ) => {
		const amount = ( 10 ** ( ( i + 1 ) * 3 ) );

		if ( num < amount && ( i < selectedIndex ) ) {
			return i;
		}

		return selectedIndex;
	}, cutPoints.length - 1 );

	const dividend = ( 10 ** ( postCharIndex * 3 ) );
	const amount   = ( num / dividend );
	const value    = ( postCharIndex > 1 ) ? amount.toFixed( 2 ) : amount;
	const post     = cutPoints[postCharIndex] === undefined ? cutPoints.pop() : cutPoints[postCharIndex];

	return `${pre}${value}${post}`;
};
