import { Box, Button, Container, Icon } from '@chakra-ui/react'
import NextLink from 'next/link'
import { MdLogout, MdSettings } from 'react-icons/md'

const links = [
  {
    href: '/cobros',
    text: 'Cobros'
  },
  {
    href: '/recibos',
    text: 'Recibos'
  },
  {
    href: '/productos',
    text: 'Productos'
  },
  {
    href: '/informes',
    text: 'Informes'
  }
]

const iconLinks = [
  {
    href: '/configuracion',
    title: 'Configuración',
    icon: MdSettings
  },
  {
    href: '/logout',
    title: 'Cerrar sesión',
    icon: MdLogout
  }
]

export default function Navbar() {
  return (
    <Box as="nav" py="2" shadow="base" pos="sticky">
      <Container
        maxW="container.xl"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <NextLink href="/" passHref>
          <Button as="a" variant="ghost" fontSize="2xl" fontWeight="bold">
            SCIU
          </Button>
        </NextLink>

        <Box as="ul" display="flex" gap="2" listStyleType="none">
          {links.map(({ href, text }) => (
            <Box as="li" key={href}>
              <NextLink href={href} passHref>
                <Button as="a" variant="ghost">
                  {text}
                </Button>
              </NextLink>
            </Box>
          ))}
        </Box>

        <Box as="ul" display="flex" gap="2" listStyleType="none">
          {iconLinks.map(({ href, title, icon }) => (
            <Box as="li" key={href}>
              <NextLink href={href} passHref>
                <Button as="a" variant="ghost" display="flex" title={title}>
                  <Icon as={icon} />
                </Button>
              </NextLink>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}
