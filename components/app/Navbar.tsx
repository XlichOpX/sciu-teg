import { Box, Button, Container, Link, useDisclosure } from '@chakra-ui/react'
import { useAuth } from 'hooks'
import NextLink from 'next/link'
import { FaGraduationCap, FaReceipt } from 'react-icons/fa'
import { IoIosPeople, IoMdAnalytics } from 'react-icons/io'
import { MdInventory, MdMenu, MdSettings } from 'react-icons/md'
import { hideOnPrint } from 'utils/hideOnPrint'
import { Logo } from './Logo'
import { LogoutButton } from './LogoutButton'

const links = [
  {
    href: '/estudiantes',
    text: 'Estudiantes',
    icon: <FaGraduationCap />,
    permission: 'CREATE_BILLING'
  },
  {
    href: '/comunidad',
    text: 'Comunidad',
    icon: <IoIosPeople />,
    permission: 'READ_CLIENT'
  },
  {
    href: '/recibos',
    text: 'Recibos',
    icon: <FaReceipt />,
    permission: 'READ_RECEIPT'
  },
  {
    href: '/productos',
    text: 'Productos',
    icon: <MdInventory />,
    permission: 'READ_PRODUCT'
  },
  {
    href: '/informes',
    text: 'Informes',
    icon: <IoMdAnalytics />,
    permission: 'READ_REPORT'
  },
  {
    href: '/configuracion/general',
    title: 'Configuración',
    text: <MdSettings />,
    permission: 'READ_PARAMETER'
  }
]

export const Navbar = () => {
  const { getButtonProps, getDisclosureProps, isOpen, onClose } = useDisclosure()
  const { user } = useAuth()

  if (!user) return null

  const filteredLinks = links.filter((l) => user.permissions.includes(l.permission))

  return (
    <Box
      as="nav"
      pos="sticky"
      top={0}
      bgColor="transparent"
      zIndex={20}
      backdropFilter="auto"
      backdropBlur="12px"
      shadow="md"
      sx={{ ...hideOnPrint }}
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
            <Logo />
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
          {filteredLinks.map(({ href, text, title, icon }) => (
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
        {filteredLinks.map(({ href, text, title, icon }) => (
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
