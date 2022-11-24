import { Alert, Button, Divider, Flex } from '@chakra-ui/react'
import { useAuth } from 'hooks'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  BsCalendarEvent,
  BsCreditCardFill,
  BsFileSpreadsheetFill,
  BsGearFill,
  BsPersonFill
} from 'react-icons/bs'
import { FaCoins, FaExchangeAlt, FaIdCardAlt, FaRedhat } from 'react-icons/fa'
import { MdCategory } from 'react-icons/md'

const links = [
  {
    href: '/configuracion/general',
    text: 'General',
    icon: <BsGearFill />,
    permission: 'READ_PARAMETER'
  },
  {
    href: '/configuracion/usuarios',
    text: 'Usuarios',
    icon: <BsPersonFill />,
    permission: 'READ_USER'
  },
  {
    href: '/configuracion/roles',
    text: 'Roles',
    icon: <FaRedhat />,
    permission: 'READ_ROLE'
  },
  {
    href: '/configuracion/metodos-de-pago',
    text: 'Métodos de pago',
    icon: <BsCreditCardFill />,
    permission: 'READ_PAYMENTMETHOD'
  },
  {
    href: '/configuracion/tasas-de-cambio',
    text: 'Tasas de cambio',
    icon: <FaExchangeAlt />,
    permission: 'READ_CONVERSION'
  },
  {
    href: '/configuracion/categorias',
    text: 'Categorías',
    icon: <MdCategory />,
    permission: 'READ_CATEGORY'
  },
  {
    href: '/configuracion/monedas',
    text: 'Monedas',
    icon: <FaCoins />,
    permission: 'READ_CURRENCY'
  },
  {
    href: '/configuracion/tipos-de-documento',
    text: 'Tipos de documento',
    icon: <FaIdCardAlt />,
    permission: 'READ_DOCTYPE'
  },
  {
    href: '/configuracion/importar-lote',
    text: 'Importar lote de cobros',
    icon: <BsFileSpreadsheetFill />,
    permission: 'CREATE_RECEIPT'
  },
  {
    href: '/configuracion/semestres',
    text: 'Semestres',
    icon: <BsCalendarEvent />,
    permission: 'READ_SEMESTER'
  }
]

links.sort((a, b) => {
  if (a.text > b.text) return 1
  if (a.text < b.text) return -1
  return 0
})

export const SettingsSidebar = () => {
  const { asPath } = useRouter()

  const { user } = useAuth()
  if (!user) return null

  const filteredLinks = links.filter((l) => user.permissions.includes(l.permission))

  return (
    <>
      <Flex as="ul" direction="column" gap={4} listStyleType="none">
        {filteredLinks.map((li) => (
          <li key={li.href}>
            <Link href={li.href} passHref>
              <Button
                as="a"
                w="full"
                variant={asPath === li.href ? 'solid' : 'ghost'}
                justifyContent="flex-start"
                gap={4}
                pointerEvents={asPath === li.href ? 'none' : undefined}
              >
                {li.icon} {li.text}
              </Button>
            </Link>
          </li>
        ))}
        {filteredLinks.length === 0 && (
          <Alert status="error">No permiso para acceder a ninguna configuración</Alert>
        )}
      </Flex>
      <Divider mt={4} display={['block', 'none']} />
    </>
  )
}
