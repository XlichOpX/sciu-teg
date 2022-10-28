import { Button, Divider, Flex } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { BsCreditCardFill, BsGearFill, BsPersonFill } from 'react-icons/bs'
import { FaCoins, FaExchangeAlt, FaGraduationCap, FaIdCardAlt, FaRedhat } from 'react-icons/fa'
import { MdCategory } from 'react-icons/md'

const links = [
  {
    href: '/configuracion/general',
    text: 'General',
    icon: <BsGearFill />
  },
  {
    href: '/configuracion/usuarios',
    text: 'Usuarios',
    icon: <BsPersonFill />
  },
  {
    href: '/configuracion/roles',
    text: 'Roles',
    icon: <FaRedhat />
  },
  {
    href: '/configuracion/metodos-de-pago',
    text: 'Métodos de pago',
    icon: <BsCreditCardFill />
  },
  {
    href: '/configuracion/tasas-de-cambio',
    text: 'Tasas de cambio',
    icon: <FaExchangeAlt />
  },
  {
    href: '/configuracion/categorias',
    text: 'Categorías',
    icon: <MdCategory />
  },
  {
    href: '/configuracion/monedas',
    text: 'Monedas',
    icon: <FaCoins />
  },
  {
    href: '/configuracion/tipos-de-documento',
    text: 'Tipos de documento',
    icon: <FaIdCardAlt />
  },
  {
    href: '/configuracion/carreras',
    text: 'Carreras',
    icon: <FaGraduationCap />
  }
]

links.sort((a, b) => {
  if (a.text > b.text) return 1
  if (a.text < b.text) return -1
  return 0
})

export const SettingsSidebar = () => {
  const { asPath } = useRouter()
  return (
    <>
      <Flex as="ul" direction="column" gap={4} listStyleType="none">
        {links.map((li) => (
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
      </Flex>
      <Divider mt={4} display={['block', 'none']} />
    </>
  )
}
