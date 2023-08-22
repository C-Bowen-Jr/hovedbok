import { createStore } from 'redux';

const initialState = {
    productList: [{
        img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
        title: 'Burger',
    }],
    receiptList: [{
        myProduct: true,
        quantity: 1,
        name: "My product",
        tags: '',
        price: 0.00,
    }],
};

export const setProductList = (value) => ({
    type: 'SET_PRODUCT_LIST',
    payload: value,
});

export const setReceiptList = (value) => ({
    type: 'SET_RECEIPT_LIST',
    payload: value,
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PRODUCT_LIST':
            return {...state, productList: action.payload};
        case 'SET_RECEIPT_LIST':
            return {...state, receiptList: action.payload};
        default:
            return state;
    }
};

const store = createStore(reducer);

export default store;