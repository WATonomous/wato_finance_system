import { extendTheme } from '@chakra-ui/react'

const watoColors = {
    offBlack: '#222222',
    grey: '#414141',
    offWhite: '#c7cfd8',

    primaryDark: '#08192d',
    primary: '#0f4271',
    secondary: '#1f5d96',

    greenDark: '#0c4842',
    greenLight: '#66ddc8',

    redDark: '#92093a',
    redLight: '#d8436d',
}

const watoLightButtonVariants = ['offWhite', 'greenLight', 'redLight'].map(
    (color) => ({
        [color]: {
            bgColor: `wato.${color}`,
            _hover: {
                bgColor: `wato.${color}`,
                ':disabled': {
                    bgColor: `wato.${color}`,
                },
            },
        },
    })
)

const watoDarkButtonVariants = [
    'offBlack',
    'grey',
    'primaryDark',
    'primary',
    'secondary',
    'greenDark',
    'redDark',
].map((color) => ({
    [color]: {
        color: 'white',
        bgColor: `wato.${color}`,
        _hover: {
            bgColor: `wato.${color}`,
            ':disabled': {
                bgColor: `wato.${color}`,
            },
        },
    },
}))

export const WATonomousTheme = extendTheme({
    colors: {
        wato: watoColors,
    },
    components: {
        Button: {
            baseStyle: {
                _hover: {
                    filter: 'brightness(110%)',
                },
            },
            variants: Object.assign(
                {},
                ...watoLightButtonVariants,
                ...watoDarkButtonVariants
            ),
        },
    },
})
