<template lang='pug'>
#app
	router-view
</template>

<script>
import { RefreshToken } from '@/lib/API';

export default {
	name : 'app',

	data : () => ( {

	} ),

	computed : {
		accessToken() {
			return this.$store.state.accessToken;
		},

		accessTokenExpiry() {
			return this.$store.state.accessTokenExpiry;
		},

		selectedContract() {
			return this.$store.state.selectedContract;
		}
	},

	watch : {
		accessToken : {
			immediate : true,
			handler( accessToken ) {
				if ( !accessToken ) {
					return;
				}

				const { accessTokenExpiry } = this;

				setTimeout( () => {
					RefreshToken()
						.then( ( data ) => {
							this.$store.dispatch( 'setUserStuff', data.user );
							this.$store.dispatch( 'setAccessToken', data );
						} );
				}, accessTokenExpiry - 5000 );

				if ( this.selectedContract === null ) {
					this.$router.push( { path : '/app/select-contract' } );
				}
			}
		}
	},

	methods : {

	}

};
</script>

<style lang="scss">
@import "./assets/scss/custom.scss";
@import "./assets/scss/shapes.scss";
#app {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	height: 100%;
}

#nav {
	padding: 30px;

	a {
		font-weight: 700;
		color: #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>
