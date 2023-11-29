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
					900: '#A0000F'
				}
			},
			boxShadow: {
				custom: '0px 0px 0px 3px #ECA6A2'
			}
		}
	},
	daisyui: {
		themes: ['light']
	}
};

module.exports = config;
