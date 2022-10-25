import { Box, Button, Container, Link, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import NextLink from 'next/link'
import { MdMenu, MdSettings } from 'react-icons/md'
import { LogoutButton } from './LogoutButton'

const links = [
  {
    href: '/estudiantes',
    text: 'Estudiantes'
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
  },
  {
    href: '/configuracion/general',
    title: 'Configuración',
    text: <MdSettings />
  }
]

export const Navbar = () => {
  const { getButtonProps, getDisclosureProps, isOpen, onClose } = useDisclosure()
  const bg = useColorModeValue('white', 'gray.800')

  return (
    <Box as="nav" shadow="base" pos="sticky" top={0} bgColor={bg} zIndex={20}>
      <Container
        maxW="container.xl"
        display="flex"
        py={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <NextLink href="/" passHref>
          <Link fontSize="2xl" fontWeight="bold">
            SCIU
          </Link>
        </NextLink>

        <Button
          variant="ghost"
          fontSize="2xl"
          {...getButtonProps()}
          display={['block', null, 'none']}
          title={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <MdMenu />
        </Button>

        {/* Desktop menu */}
        <Box as="ul" display={['none', null, 'flex']} gap="2" listStyleType="none">
          {links.map(({ href, text, title }) => (
            <li key={href}>
              <NextLink href={href} passHref>
                <Button as="a" variant="ghost" title={title}>
                  {text}
                </Button>
              </NextLink>
            </li>
          ))}
          <li>
            <LogoutButton />
          </li>
        </Box>
      </Container>

      {/* Mobile menu */}
      <Box
        as="ul"
        listStyleType="none"
        bgColor="white"
        display={['flex', null, 'none']}
        flexDirection="column"
        {...getDisclosureProps()}
      >
        {links.map(({ href, text, title }) => (
          <li key={href}>
            <NextLink href={href} passHref>
              <Button as="a" variant="ghost" width="full" title={title} onClick={onClose}>
                {text}
              </Button>
            </NextLink>
          </li>
        ))}
        <li>
          <LogoutButton />
        </li>
      </Box>
    </Box>
  )
}
