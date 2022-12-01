import { Product } from '../types/Product';

type Props = {
  product: Product,
};

export const ProductInfo: React.FC<Props> = ({ product }) => {
  const {
    name,
    id,
    user,
    category,
  } = product;

  return (
    <tr data-cy="Product">
      <td className="has-text-weight-bold" data-cy="ProductId">
        {id}
      </td>

      <td data-cy="ProductName">{name}</td>
      <td data-cy="ProductCategory">{`${category.icon} - ${category.title}`}</td>

      {}
      <td
        data-cy="ProductUser"
        className="has-text-link"
      >
        {user.name}
      </td>
    </tr>
  );
};
