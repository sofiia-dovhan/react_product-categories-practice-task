import { User } from './User';
import { Category } from './Category';

export interface Product {
  id: number,
  name: string,
  categoryId: number,
  user: User | undefined,
  category: Category | undefined,
}