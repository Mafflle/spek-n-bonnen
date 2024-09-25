import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				black: '#2D2D2D',
				background: '#EBEBEB',
				primary: '#D7362C'
			},
			fontFamily: {
				inter: ['Inter', 'system-ui']
			}
		}
	},

	plugins: [require('@tailwindcss/typography')]
} as Config;
