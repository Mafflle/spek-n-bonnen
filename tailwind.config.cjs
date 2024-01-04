const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	plugins: [require('daisyui')],

	darkMode: 'false',

	theme: {
		extend: {
			colors: {
				// flowbite-svelte
				primary: {
					50: '#DA4E45',
					100: '#D3443F',
					200: '#CC3A39',
					300: '#C53033',
					400: '#BE262D',
					500: '#B81C27',
					600: '#B21221',
					700: '#AC081B',
					800: '#A60015',
					900: '#A0000F',
					red: '#DC5950',
					light: '#FFE8E7'
				},
				secondary: {
					50: '#9c9c9c'
				},
				grey: {
					100: '#6B6B6B',
					200: '#9c9c9c',
					300: '#D9D9D9'
				},
				sGray: '#F5F5F5'
			},
			boxShadow: {
				custom: '0px 0px 0px 3px #ECA6A2'
			},
			fontFamily: {
				satoshi: ['Satoshi', 'sans-serif']
			}
		}
	},
	daisyui: {
		themes: ['light']
	}
};

module.exports = config;
