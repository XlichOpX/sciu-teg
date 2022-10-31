import { AddProductFormSubmitHandler, ProductReceivable } from 'components/charges'
import { useCallback, useState } from 'react'

export const useReceivables = () => {
  const [products, setProducts] = useState<ProductReceivable[]>([])

  const addProduct: AddProductFormSubmitHandler = useCallback(
    (product) => {
      const existentProductIndex = products.findIndex((p) => p.id === product.id)
      const isExistentProduct = existentProductIndex >= 0
      // Si el producto ya estaba, lo reemplazamos
      if (isExistentProduct) {
        setProducts([
          ...products.slice(0, existentProductIndex),
          product,
          ...products.slice(existentProductIndex + 1)
        ])
      } else {
        setProducts([...products, product])
      }
    },
    [products]
  )

  const removeProduct = useCallback(
    (productId: number) => setProducts(products.filter((p) => p.id !== productId)),
    [products]
  )

  const resetProducts = useCallback(() => setProducts([]), [])

  return {
    products,
    addProduct,
    removeProduct,
    resetProducts,
    isEmpty: products.length === 0
  }
}
