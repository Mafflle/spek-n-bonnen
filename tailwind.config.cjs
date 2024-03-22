import { fontFamily } from 'tailwindcss/defaultTheme';
/** @type {import('tailwindcss').Config} */

const config = {
	content: ['./src/**/*.{html,js,svelte,ts,pcss}'],

	plugins: [require('daisyui')],

	darkMode: ['class'],
	safelist: ['dark'],

	theme: {
		container: {
			center: true,
			padding: '2rem'
		},
		extend: {
			screens: {
				xs: { raw: '(min-width: 200px)' },
				xsm: { raw: '(min-width: 400px)' },
				'max-xsm': { raw: '(max-width: 450px)' },
				'max-xs': { raw: '(max-width: 768px)' }
			},
			colors: {
				// flowbite-svelte
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					25: '#C7453C',
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
					light: '#FFE8E7',
					softPink: { 50: '#ECA6A2', 100: '#FFF4F3' },
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					50: '#9c9c9c',
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
				},
				grey: {
					100: '#6B6B6B',
					200: '#9c9c9c',
					300: '#D9D9D9'
				},
				black: {
					100: '#2D2D2D'
				},
				sGray: '#F5F5F5',
				pGrey: '#f0f0f0',
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				custom: '0px 0px 0px 3px #ECA6A2'
			},
			fontFamily: {
				satoshi: ['Satoshi', 'sans-serif'],
				sans: ['Inter', ...fontFamily.sans]
			}
		}
	},
	daisyui: {
		themes: ['light']
	}
};

module.exports = config;
