<template lang='pug'>
b-container.login(fluid, v-if="!isloading")
	b-row.header
		b-col
			b-img.mt-4(:src="require('../assets/images/logo.png')")
	b-row.ellipse
	b-row.mt-3
		b-col
			h4.title SIGN IN
	b-row.mt-3
		b-col
			b-form(@submit.prevent="onSubmit")
				b-form-group#username.label(label="Email", label-for="username")
					b-form-input#username.input-field(
						type="text",
						required,
						placeholder="User123@gmail.com"
						v-model='email'
					)

				b-form-group#password.label(label="Password", label-for="password")
					b-form-input#password.input-field(
						type="password",
						required,
						placeholder="*********"
						v-model='password'
					)

				p.error-msg(v-show='errorMessage') {{ errorMessage }}

				b-form-group#checkbox
					b-form-checkbox-group#checkbox(size="sm")
						b-form-checkbox(value="true") Remember me

				b-button.submit-btn(type="submit") Submit
	b-row.footer
		b-col
			p Grower Portal App
				br
				b.footer-title KEENAN FARMS, INC
SplashScreen(v-else)
</template>

<style lang="scss">
.header {
	background: $color-primary;
	height: 150px;
}
.login {
	background: $bg-color;
	box-shadow: 0px 0px 30px rgba(14, 51, 63, 0.15),
		0px 0px 3px rgba(14, 51, 63, 0.15);
	height: 100%;
}
.ellipse {
	border-top-left-radius: 50% 100%;
	border-top-right-radius: 50% 100%;
	height: 60px;
	margin-top: -60px;
	background: $bg-color;
}
.title {
	color: $color-primary;
	font-family: Bitter;
	font-style: normal;
	font-weight: 700;
	font-size: 31px;
	line-height: 42px;
	text-align: center;
	letter-spacing: 0.12em;
	text-transform: uppercase;
}
.label {
	font-family: Manjari;
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	line-height: 0px;
	text-align: center;
	letter-spacing: 0.03em;
	color: $color-primary;
}
.input-field {
	background-image: none !important;
	background: rgba(2, 106, 68, 0.11);
	border-radius: 50px;
	margin-bottom: 30px;
	border: none;
	text-align: center;
	color: $color-primary;
	font-size: 19px;
}

img#__lpform_username_icon,
img#__lpform_password_icon {
	display: none;
}
.input-field:hover,
.input-field:focus,
.input-field:active {
	background: rgba(2, 106, 68, 0.11);
	outline: none;
	border: none;
	box-shadow: none;
	color: $color-primary;
}
.submit-btn {
	background: $color-secondary;
	box-shadow: 0px 2px 15px rgba(14, 51, 63, 0.15),
		0px 2px 3px rgba(14, 51, 63, 0.15);
	border-radius: 50px;
	width: 150px;
	border: none;
	font-weight: 700;
	font-size: 17px;
	text-transform: uppercase;
}
.submit-btn:hover,
.submit-btn:active,
.submit-btn:focus {
	background: $color-primary;
}
#checkbox {
	margin-bottom: 15px;
	font-size: 12px;
	letter-spacing: 0.03em;
	color: $color-primary;
}
.footer {
	position: fixed;
	bottom: 0px;
	width: 100%;
	font-family: Bitter;
	font-style: italic;
	font-weight: 400;
	font-size: 10px;
	line-height: 14px;
	letter-spacing: 0.08em;
	color: $color-primary;
}
.footer-title {
	font-style: normal;
}
.input-field::placeholder {
	font-family: Manjari;
	font-size: 19px;
	text-align: center;
	color: rgba(2, 106, 68, 0.19);
}
.custom-control-input {
	color: $color-primary !important;
}
.custom-control-label::before {
	background-color: $color-secondary !important;
	border: none;
	box-shadow: none;
	outline: none;
}

p.error-msg {
	color : #d44545;
	letter-spacing: .1em;
	text-transform: uppercase;
	font-size: 12px
}

</style>

<script>
import SplashScreen from './app/Splash';

export default {
	components : {
		SplashScreen,
	},

	name : 'login',

	data : () => ( {
		isloading    : false,
		email        : '',
		password     : '',
		errorMessage : ''
	} ),
	methods : {
		onSubmit() {
			const { email, password } = this;

			const credentials = {
				email,
				password
			};
			this.$store.dispatch( 'Login', credentials )
				.then( () => {
					// this.$router.push( 'app' );
				} )
				.catch( ( e ) => {
					console.warn( e );
					this.errorMessage = e.msg;
				} );

		},
	},
};
</script>
