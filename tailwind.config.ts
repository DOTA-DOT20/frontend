import type { Config } from 'tailwindcss'
import {nextui} from "@nextui-org/react";


const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      'pink': '#DE0376',
    },
    extend: {
      backgroundImage: {
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    defaultTheme: "dark",
    defaultExtendTheme: "dark",
    themes: {
      dark: {
        colors: {
          default: '#DE0376',
          primary: '#DE0376',
        },
      },
    },
  })]
}
export default config
