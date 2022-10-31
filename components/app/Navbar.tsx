import { Box, Button, Container, Link, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import NextLink from 'next/link'
import { FaGraduationCap, FaReceipt } from 'react-icons/fa'
import { IoIosPeople, IoMdAnalytics } from 'react-icons/io'
import { MdInventory, MdMenu, MdSettings } from 'react-icons/md'
import { LogoutButton } from './LogoutButton'

const links = [
  {
    href: '/estudiantes',
    text: 'Estudiantes',
    icon: <FaGraduationCap />
  },
  {
    href: '/comunidad',
    text: 'Comunidad',
    icon: <IoIosPeople />
  },
  {
    href: '/recibos',
    text: 'Recibos',
    icon: <FaReceipt />
  },
  {
    href: '/productos',
    text: 'Productos',
    icon: <MdInventory />
  },
  {
    href: '/informes',
    text: 'Informes',
    icon: <IoMdAnalytics />
  },
  {
    href: '/configuracion/general',
    title: 'Configuración',
    text: <MdSettings />
  }
]

export const Navbar = () => {
  const { getButtonProps, getDisclosureProps, isOpen, onClose } = useDisclosure()
  const bg = useColorModeValue('white', 'transparent')

  return (
    <Box
      as="nav"
      pos="sticky"
      top={0}
      bgColor={bg}
      zIndex={20}
      backdropFilter="auto"
      backdropBlur="12px"
    >
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
          {links.map(({ href, text, title, icon }) => (
            <li key={href}>
              <NextLink href={href} passHref>
                <Button as="a" variant="ghost" title={title} leftIcon={icon}>
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
        display={['flex', null, 'none']}
        flexDirection="column"
        {...getDisclosureProps()}
      >
        {links.map(({ href, text, title, icon }) => (
          <li key={href}>
            <NextLink href={href} passHref>
              <Button
                as="a"
                variant="ghost"
                width="full"
                title={title}
                onClick={onClose}
                leftIcon={icon}
              >
                {text}
              </Button>
            </NextLink>
          </li>
        ))}
        <li>
          <LogoutButton w="full" />
        </li>
      </Box>
    </Box>
  )
}
