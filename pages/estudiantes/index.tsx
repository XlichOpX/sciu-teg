import { Alert } from '@chakra-ui/react'
import { StudentsLayout } from 'components/students'
import { NextPageWithLayout } from '../_app'

const StudentsIndex: NextPageWithLayout = () => {
  return (
    <>
      <Alert>Busque un estudiante por su cédula...</Alert>
    </>
  )
}

StudentsIndex.getLayout = (page) => <StudentsLayout>{page}</StudentsLayout>

export default StudentsIndex
