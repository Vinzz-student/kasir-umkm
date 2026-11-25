export type Product = {
  id: number;
  category_id: number;
  category_name?: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  is_available: boolean;
};
