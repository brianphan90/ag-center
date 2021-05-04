<template lang='pug'>
.home
	router-view
	nav-bar(v-if='navbarDisplay')
</template>
<style lang="scss">
.home{
	height: 100%;
}
</style>
<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar';
import { GetManifests } from '@/lib/API';

export default {
	name : 'Home',

	components : {
		NavBar,
	},

	methods : {

	},
	computed : {
		navbarDisplay() {
			return this.$store.state.navbarDisplay;
		}
	}
};
</script>
