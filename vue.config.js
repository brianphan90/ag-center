module.exports = {
	css : {
		loaderOptions : {
			// pass options to sass-loader
			sass : {
				// @/ is an alias to src/
				// so this assumes you have a file named `src/assets/variables.scss`
				prependData : '@import "@/assets/scss/variables.scss";'
			}
		}
	},
};
