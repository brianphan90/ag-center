<template lang="pug">
.splash
	b-row
		b-col
			h1
				| Grower
				br
				| Portal
	b-row.footer
		b-col
			h6 Kenaans Farms, Inc.
</template>

<style lang="scss" scoped>
.splash {
	background: $color-primary;
	height: 100%;
	width: 100%;
	color: $color;
}
h1 {
	font-family: Bitter;
	font-weight: bold;
	font-size: 56px;
	margin-top: 165px;
}
h6 {
	font-family: Bitter;
	font-weight: bold;
	letter-spacing: 0.05em;
}
.footer {
	position: absolute;
	bottom: 40px;
	right: 25%;
	left: 25%;
}
</style>
<script>
export default {
	name : 'Splash'
};
</script>
