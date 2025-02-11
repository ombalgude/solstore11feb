import { encodeBase64 } from "./encoding"

export const generatePaymentLink = (productId: string, price: number, title: string) => {
  // Create payment parameters
  const params = {
    productId,
    price,
    title: encodeURIComponent(title),
    timestamp: Date.now()
  }

  // Encode parameters as base64 to make URL cleaner
  const encodedParams = encodeBase64(JSON.stringify(params))
  
  // Generate payment URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/pay/${encodedParams}`
}

export const decodePaymentLink = (encodedParams: string) => {
  try {
    const decodedParams = JSON.parse(atob(encodedParams))
    return {
      productId: decodedParams.productId,
      price: decodedParams.price,
      title: decodeURIComponent(decodedParams.title),
      timestamp: decodedParams.timestamp
    }
  } catch (error) {
    console.error('Error decoding payment link:', error)
    return null
  }
}