export const getDiffLabel = (number: number) => {
  if (number > 0) {
    return 'Sobran'
  }
  if (number < 0) {
    return 'Faltan'
  }
}
