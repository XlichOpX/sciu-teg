import { Alert } from '@chakra-ui/react'
import { CommunityLayout, CreateClientModal } from 'components/community'
import { useAuth } from 'hooks'
import { NextPageWithLayout } from '../_app'

const CommunityIndex: NextPageWithLayout = () => {
  const { user } = useAuth()
  if (!user) return null
  return (
    <>
      <Alert mb={4}>Busque una persona por su número de documento...</Alert>
      {user.permissions.includes('CREATE_CLIENT') && <CreateClientModal />}
    </>
  )
}

CommunityIndex.getLayout = (page) => <CommunityLayout>{page}</CommunityLayout>

export default CommunityIndex
