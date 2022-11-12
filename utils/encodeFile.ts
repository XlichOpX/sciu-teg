/** Codifica el archivo a base64 de forma asíncrona */
export function encodeFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result !== 'string') {
        reject("Couldn't parse file")
        return
      }
      const encodedFile = reader.result.replace(/data:.*\/.*;base64,/, '')
      resolve(encodedFile)
    })
    reader.readAsDataURL(file)
  })
}
