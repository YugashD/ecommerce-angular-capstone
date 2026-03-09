// Represents a product.
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// Represents the data structure for creating or updating a product.
export interface ProductUpsert {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}
