import React, {useEffect} from "react"
import CartItem from '../CartItem'
import Auth from '../../utils/auth'
import './styles.css'

import {QUERY_CHECKOUT} from '../../utils/queries'
import { loadStripe } from '@stripe/stripe-js'
import { useDispatch, useSelector } from 'react-redux'
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../redux/actions'
import { idbPromise } from "../../utils/helpers"
import { useLazyQuery } from '@apollo/client'

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx')



export default function Cart() {
    // const [state, dispatch] = useStoreContext()
    const dispatch = useDispatch()
    const state = useSelector(state => state)

    const [getCheckout, {data}] = useLazyQuery(QUERY_CHECKOUT)

    useEffect(() => {
        async function getCart() {
            const cart = await idbPromise('cart', 'get')
            dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] })
        }

        if (!state.cart.length) {
            getCart()
        }
    }, [state.cart.length, dispatch])

    useEffect(() => {
        if (data) {
            stripePromise.then(res => {
                res.redirectToCheckout({ sessionId: data.checkout.session })
            })
        }
    }, [data])

    function toggleCart() {
        dispatch({ type: TOGGLE_CART })
    }

    function calculateTotal() {
        let sum = 0
        state.cart.forEach(item => {
            sum += item.price * item.purchaseQuantity
        })

        return sum.toFixed(2)
    }

    function submitCheckout() {
        const productIds = []

        state.cart.forEach(item => {
            for (let i=0; i<item.purchaseQuantity; i++) {
                productIds.push(item._id)
            }
        })

        getCheckout({
            variables: { products: productIds }
        })
    }

    if (!state.cartOpen) {
        return (
            <div className='cart-closed' onClick={toggleCart}>
                <span  
                    role='img'
                    aria-label="cart"
                >🛒</span>
            </div>
        )
    }

    return (
        <div className='cart'>
            <div className='close' onClick={toggleCart}>[close]</div>
            <h2>Shopping Cart</h2>
            <div>
                {state.cart.map(item => (
                    <CartItem key={item._id} item={item} />
                ))}
            </div>

            <div className='flex-row space-between'>
                <strong>Total: ${calculateTotal()}</strong>
                {
                    Auth.loggedIn() ?
                        <button onClick={submitCheckout}>
                            Checkout
                        </button>
                        :
                        <span>(login to checkout)</span>
                }
            </div>
        </div>
    )
}