import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

function getUser(ownerId?: number) {
  const foundUser = usersFromServer.find(user => user.id === ownerId);

  return foundUser || null;
}

function getCategory(categoryId: number) {
  const foundCategory = categoriesFromServer.find(
    category => category.id === categoryId,
  );

  return foundCategory || null;
}

export const products = productsFromServer.map(product => {
  const category = getCategory(product.categoryId);
  const user = getUser(category?.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

export const App: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryId, setSelectedCategoryId]
    = useState<number | null>(null);

  let visibleProducts = [...products];

  const resetFilters = () => {
    setSelectedUserId(null);
    setQuery('');
    setSelectedCategory('');
  };

  if (selectedUserId !== null) {
    visibleProducts = visibleProducts.filter(product => (
      product.user?.id === selectedUserId));
  }

  if (query !== '') {
    visibleProducts = visibleProducts.filter(product => (
      product.name.toLowerCase().includes(query.toLowerCase())));
  }

  if (selectedCategory !== '') {
    visibleProducts = visibleProducts.filter(
      product => product.category?.title === selectedCategory,
    );
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectedUserId(null)}
                className={classNames({
                  'is-active': selectedUserId === null,
                })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setSelectedUserId(user.id)}
                  className={classNames({
                    'is-active': selectedUserId === user.id,
                  })}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query !== '' && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={classNames(
                  'button is-success mr-6',
                  {
                    'is-outlined': selectedCategory !== '',
                  },
                )}
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedCategoryId(null);
                }}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className={classNames(
                    'button mr-2 my-1',
                    {
                      'is-info': selectedCategoryId === category.id
                      && selectedCategory !== '',
                    },
                  )}
                  href="#/"
                  onClick={() => {
                    setSelectedCategory(category.title);
                    setSelectedCategoryId(category.id);
                  }}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => resetFilters()}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {visibleProducts.length > 0 && (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a
                        href="#/"
                      >
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User

                      <a
                        href="#/"
                      >
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => (
                  <tr data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {`${product.category?.icon} - ${product.category?.title}`}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={product.user?.sex === 'm'
                        ? 'has-text-link'
                        : 'has-text-danger'}
                    >
                      {product.user?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
