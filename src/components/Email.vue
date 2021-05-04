<template lang="pug">
b-container.email(v-if="!submit")
	b-row.header(align-v="center")
		b-col.mt-5(v-if="titles")
			h6(v-for='title in titles') Grower Manifest #: {{ typeof title === 'object' ? title.meta.growerManifestNum : title }}
		b-col(v-else)
			h6 {{ onlyTitle }}
	b-row.body(align-v="center")
		b-col
			h4 Would you like to send
			h4.mb-5 the {{ emailType === 'Payment Schedule' ? 'schedule' : emailPageType }} to this email?
			b-form(@submit.prevent="onSubmit")
				b-input-group.mb-4
					b-form-input#email.input-field.p-4(
						type="email"
						required
						placeholder="pistachiodude@gmail.com"
						v-model="email"
					)
					b-input-group-append
						b-button.clearButton
							b-iconX(@click='onClear' font-scale="2")
				b-button.submit-btn.py-3(type="submit" pill) SEND
EmailSent(v-else :emailType="emailType")
</template>

<style lang="scss" scoped>
.email {
	background-color: $color;
	color: $color-primary;
	height: 88%;
	font-family: Bitter;
}
.header{
	height: 18%;
	background: $color;
}
.body{
	height: 68%;
}
h1 {
	font-family: Bitter;
	font-weight: bold;
	font-size: 56px;
	margin-top: 165px;
}
h6 {
	font-family: Bitter;
	font-weight: 600;
	size: 17px;
	line-height: 20.4px;
	letter-spacing: -2%;
	align-content: center;
}
.footer {
	position: absolute;
	bottom: 40px;
	right: 25%;
	left: 25%;
}
#email {
	background: $bg-color;
	color: $color-primary;
	font-family: Manjari;
	border: 0;
}
.submit-btn {
	width: 45%;
	background: $color-primary;
	font-family: Manjari;
	font-weight: 800;
	font-size: 20px;
	letter-spacing: .15em;
}
.clearButton {
	background: #F8A79E;
}
</style>
<script>
import { BIconX } from 'bootstrap-vue';
import EmailSent from './EmailSent';

export default {
	name       : 'Email',
	components : {
		BIconX,
		EmailSent
	},
	props : {
		titles : {
			type : Array,
		},
		emailPageType : {
			type : String,
		},
		emailType : {
			type : String,
		},
		onlyTitle : {
			type : String,
		}
	},
	data() {
		return {
			email  : '',
			submit : false
		};
	},
	methods : {
		onSubmit() {
			// Do Work
			this.submit = !this.submit;
		},
		onClear() {
			this.email = '';
		}
	}
};
</script>
