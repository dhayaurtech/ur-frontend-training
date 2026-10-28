import { ReactNode } from 'react'

const ProductLayout = ({children}:Readonly<{children:ReactNode}>) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default ProductLayout;
