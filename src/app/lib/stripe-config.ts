export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_Sgm9j9rJ9z2pS1',
    priceId: 'price_1RlOavRjYuUozJvdvCNaWp8P',
    name: 'Blog Premium',
    description: 'Access to premium blog content and features',
    mode: 'subscription',
    price: 100, // $1.00 in cents
    currency: 'usd'
  }
];

export function getProductById(id: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.id === id);
}

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}