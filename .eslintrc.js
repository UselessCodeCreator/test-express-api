module.exports = {
	env: {
		commonjs: true,
		es2017: true,
		node: true,
		mocha: true
	},
	extends: 'eslint:recommended',
	parserOptions: {
		ecmaVersion: 12
	},
	plugins: [
		'mocha',
	],
	rules: {
		'no-trailing-spaces': 'error',
		'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 0 }],
		'eol-last': 'error',
		'linebreak-style': [
			'error',
			'unix'
		],
		indent: [
			'error',
			'tab'
		],
		quotes: [
			'error',
			'single'
		],
		semi: [
			'error',
			'always'
		]
	}
};
