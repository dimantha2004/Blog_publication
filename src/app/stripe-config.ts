export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: string;
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_Sgm9j9rJ9z2pS1',
    priceId: 'price_1RlOavRjYuUozJvdvCNaWp8P',
    name: 'Blog',
    description: 'Access to premium blog content and features',
    mode: 'subscription',
    price: '$1.00/month'
  }
];

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};