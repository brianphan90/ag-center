<template lang="pug">
.splash
	b-row.mb-3
		b-col
			h1 Email Sent!
	b-row
		b-col
			h6 Your {{ emailType }} will
			h6 arrive in your inbox soon.
</template>

<style lang="scss" scoped>
.splash {
	background: $color-primary;
	height: 100%;
	width: 100%;
	color: $color;
	overflow: hidden;
}
h1 {
	font-family: Bitter;
	font-weight: 700;
	font-size: 42px;
	margin-top: 165px;
	line-height: 63px;
}
h6 {
	font-family: Manjari;
	font-weight: 700;
	font-size: 17px;
	line-height: 29px;
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
	name  : 'Splash',
	props : {
		emailType : {
			type : String,
		}
	},
};
</script>
