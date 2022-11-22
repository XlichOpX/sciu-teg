import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true
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

export const theme = extendTheme({ config, components: { Table } })
