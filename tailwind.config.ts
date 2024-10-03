import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				black: '#2D2D2D',
				background: '#EBEBEB',
				primary: { black: '#2D2D2D', DEFAULT: '#D7362C' },
				grey: {
					100: '#727272',
					200: '#E4E4E7',
					special: '#9C9C9C',
					bg: '#F5F5F5',
					text: '#D9D9D9'
				},
				border: { DEFAULT: '#C9C7C7', black: '#373737' }
			},
			fontFamily: {
				inter: ['Inter', 'system-ui']
			}
		}
	},

	plugins: [require('@tailwindcss/typography')]
} as Config;
