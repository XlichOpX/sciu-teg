import { Alert } from '@chakra-ui/react'
import { CommunityLayout } from 'components/community'
import { NextPageWithLayout } from '../_app'

const CommunityIndex: NextPageWithLayout = () => {
  return <Alert>Busque una persona por su número cédula...</Alert>
}

CommunityIndex.getLayout = (page) => <CommunityLayout>{page}</CommunityLayout>

export default CommunityIndex
