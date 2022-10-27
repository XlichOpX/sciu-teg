import { HeadingWithSearch } from 'components/app'
import { BaseLayout } from 'components/layouts'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

export const StudentsLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter()

  return (
    <BaseLayout>
      <Head>
        <title>Estudiantes</title>
      </Head>
      <HeadingWithSearch
        title="Estudiantes"
        placeholder="Cédula"
        onSubmit={({ text }) => {
          router.push(`/estudiantes/${text}`)
        }}
      />
      {children}
    </BaseLayout>
  )
}
