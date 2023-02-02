/** @type {import('tailwindcss').Config} */
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				blossom: {
					100: "#fcedf2",
					200: "#f9dce5",
					300: "#f7cad8",
					400: "#f4b9cb",
					500: "#f1a7be",
					600: "#c18698",
					700: "#916472",
					800: "#60434c",
					900: "#302126"
				},
			}
		}
	},

	plugins: []
};

module.exports = config;
