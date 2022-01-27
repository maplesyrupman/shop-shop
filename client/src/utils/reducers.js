import { useReducer } from 'react'

import {
    UPDATE_CURRENT_CATEGORY,
    UPDATE_CATEGORIES,
    UPDATE_PRODUCTS,
    ADD_TO_CART,
    ADD_MULTIPLE_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_CART_QUANTITY,
    CLEAR_CART,
    TOGGLE_CART
} from './actions'

export const reducer = (state, action) => {
    switch (action.type) {
        case UPDATE_PRODUCTS:
            return {
                ...state, 
                products: [...action.products],
            }

        case UPDATE_CATEGORIES:
            return {
                ...state,
                categories: [...action.categories]
            }

        case UPDATE_CURRENT_CATEGORY:
            return {
                ...state,
                currentCategory: action.currentCategory
            }

        case ADD_TO_CART:
            return {
                ...state,
                cartOpen: true,
                cart: [...state.cart, action.product]
            }

        case ADD_MULTIPLE_TO_CART:
            return {
                ...state,
                cartOpen: true,
                cart: [...state.cart, ...action.products]
            }

        case REMOVE_FROM_CART:
            let newState = state.cart.filter(product => product._id !== action._id)
            return {
                ...state, 
                cartOpen: newState.length > 0,
                cart: newState
            
            }

        case UPDATE_CART_QUANTITY:
            const newCart = state.cart.map(product => {
                if (product._id === action._id) {
                    product.purchaseQuantity = action.purchaseQuantity
                }
                return product
            })

            return {
                ...state,
                cart: newCart,
                cartOpen: true
            }
        
        case CLEAR_CART:
            return {
                ...state,
                cart: [],
                cartOpen: false
            }

        case TOGGLE_CART:
            return {
                ...state,
                cartOpen: !state.cartOpen
            }

        default: 
            return state
    }
}

export function useProductReducer(initialState) {
    return useReducer(reducer, initialState)
}