// products.config.ts - Store your actual Stream Pay product UUIDs here
export const PRODUCTS = {
  monthly: {
    id: '3025034d-48f9-41cf-a32e-c93a5fe36d93', // Stream Pay product UUID
    name: 'Monthly Subscription',
    price: 99,
    description: 'Full access for one month',
  },
  quarterly: {
    id: 'cfaea086-8da7-4220-afa1-0f06eef10ff0', // Stream Pay product UUID
    name: '3-Month Subscription',
    price: 249,
    description: 'Save 48 SAR',
    popular: true,
  },

};

// Helper to get product by ID
export const getProductById = (id: string) => {
  return Object.values(PRODUCTS).find(p => p.id === id);
};
