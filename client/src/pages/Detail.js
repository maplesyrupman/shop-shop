import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { useSelector, useDispatch } from 'react-redux'
import { UPDATE_PRODUCTS, REMOVE_FROM_CART, UPDATE_CART_QUANTITY, ADD_TO_CART } from "../redux/actions"
import Cart from '../components/Cart'
import { idbPromise } from '../utils/helpers'

import { QUERY_PRODUCTS } from '../utils/queries'
import spinner from '../assets/spinner.gif'

function Detail() {
  // const [state, dispatch] = useStoreContext();
  const {cart, products} = useSelector(state => state)
  const dispatch = useDispatch()
  const { id } = useParams();
  // const { cart } = state
  // const { products } = state;

  const [currentProduct, setCurrentProduct] = useState({})

  const { loading, data } = useQuery(QUERY_PRODUCTS);



  const addToCart = () => {
    const itemInCart = cart.find(p => p._id === id)

    if (itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      })
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      })
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...currentProduct, purchaseQuantity: 1 }
      })
      idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1})
    }
  }

  useEffect(() => {
    if (products.length) {
      setCurrentProduct(products.find(product => product._id === id));
    } else if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });

      data.products.forEach(product => {
        idbPromise('products', 'put', product)
      })
    } else if (!loading) {
      idbPromise('products', 'get').then(indexedProducts => {
        dispatch({
          type: UPDATE_PRODUCTS,
          products: indexedProducts
        })
      })
    }
  }, [loading, products, data, dispatch, id])

  function removeFromCart() {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: currentProduct._id
    })

    idbPromise('cart', 'delete', {...currentProduct})
  }

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">??? Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={addToCart}>Add to Cart</button>
            <button
              onClick={removeFromCart}
              disabled={!cart.find(p => p._id === currentProduct._id)}
            >
              Remove from Cart</button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
