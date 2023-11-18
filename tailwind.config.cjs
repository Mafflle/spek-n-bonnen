const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	plugins: [require('flowbite/plugin')],

	darkMode: 'class',

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
			}
		}
	}
};

module.exports = config;
