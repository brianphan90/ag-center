<template lang='pug'>
	button(
		v-bind:class='type'
	)
		span Left Icon
		| {{ label }}
		span Right Icon
</template>

<script>
export default {
	name  : 'Button',
	props : {
		label     : String,
		disabled  : Boolean,
		type      : String,
		leftIcon  : Boolean,
		rightIcon : Boolean,
		icon      : String,
		size      : String
	},
	data() {
		return {
			normal : 'normals'
		};
	}
};
</script>

<style lang="scss">
.normals {
	background: "red";
}
</style>
