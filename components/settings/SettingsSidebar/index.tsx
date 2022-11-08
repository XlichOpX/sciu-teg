import { Button, Divider, Flex } from '@chakra-ui/react'
import { useAuth } from 'hooks'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { BsCreditCardFill, BsGearFill, BsPersonFill } from 'react-icons/bs'
import { FaCoins, FaExchangeAlt, FaGraduationCap, FaIdCardAlt, FaRedhat } from 'react-icons/fa'
import { MdCategory } from 'react-icons/md'
import { SettingsSidebarSkeleton } from './SettingsSidebarSkeleton'

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
    href: '/configuracion/carreras',
    text: 'Carreras',
    icon: <FaGraduationCap />,
    permission: 'READ_CAREER'
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
  if (!user) return <SettingsSidebarSkeleton />

  return (
    <>
      <Flex as="ul" direction="column" gap={4} listStyleType="none">
        {links.map((li) => {
          if (user.permissions.includes(li.permission)) {
            return (
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
            )
          }
        })}
      </Flex>
      <Divider mt={4} display={['block', 'none']} />
    </>
  )
}
