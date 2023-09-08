import { createStore } from 'redux';
import productJsonFile from '../public/products.json';

const initialState = {
    productList: productJsonFile,
    receiptList: new Map(),
    isReceiptSelling: true,
};

export const setProductList = (value) => ({
    type: 'SET_PRODUCT_LIST',
    payload: value,
});

export const setReceiptList = (value) => ({
    type: 'SET_RECEIPT_LIST',
    payload: value,
});

export const setReceiptSelling = (value) => ({
    type: 'SET_RECEIPT_SELLING',
    payload: value,
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PRODUCT_LIST':
            return {...state, productList: action.payload};
        case 'SET_RECEIPT_LIST':
            return {...state, receiptList: action.payload};
        case 'SET_RECEIPT_SELLING':
                return {...state, isReceiptSelling: action.payload};
        default:
            return state;
    }
};

const store = createStore(reducer);

export default store;