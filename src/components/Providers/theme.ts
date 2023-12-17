import {extendTheme} from "@chakra-ui/react";

export const theme = extendTheme({
    initialColorMode: 'light',
    useSystemColorMode: false,
    colors: {
        brand: {
        },
    },
    fonts: {
        heading: 'var(--font-comfortaa)',
        body: 'var(--font-comfortaa)',
    }
});
