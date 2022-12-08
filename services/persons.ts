import { fetch } from 'lib/fetch'
import { PersonWithAll } from 'types/person'

export const getPersonById = async (id: number) => {
  return (await fetch(`/api/person/${id}`)) as PersonWithAll
}
