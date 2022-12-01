import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'system'
}

const Table = {
  variants: {
    simple: {
      th: {
        color: 'inherit'
      }
    }
  }
}

const Popover = {
  baseStyle: {
    zIndex: 1500
  },
  variants: {
    dark: {
      content: {
        bg: 'gray.700',
        color: 'whiteAlpha.900',
        border: '0'
      }
    }
  }
}

export const theme = extendTheme({ config, components: { Table, Popover } })
