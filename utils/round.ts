import { round as lodashRound } from 'lodash'

export const round = (number: number) => {
  return lodashRound(number, 2)
}
