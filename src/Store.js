import { createStore } from 'redux';
import productJsonFile from '../public/products.json';

const initialState = {
    productList: productJsonFile,
    receiptList: new Map(),
    tagPresets: [],
    buyingPresets: [
        { quantity: "1", name: "Website", cost: "29.99", tags: "Hosting", includes: "[# $ \u{1f9fe} \u{1f3f7}]" },
        { quantity: "", name: "Bubble Mailers", cost: "", tags: "Supplies", includes: "[\u2800 \u2800 \u{1f9fe} \u{1f3f7}]"}
    ],
    sellTags: [],
    isReceiptSelling: true,
    isNewProductWindow: false,
};

export const setProductList = (value) => ({
    type: 'SET_PRODUCT_LIST',
    payload: value,
});

export const setReceiptList = (value) => ({
    type: 'SET_RECEIPT_LIST',
    payload: value,
});

export const setTagPresets = (value) => ({
    type: 'SET_TAG_PRESETS',
    payload: value,
});

export const setBuyingPresets = (value) => ({
    type: 'SET_BUYING_PRESETS',
    payload: value,
});

export const setSellTags = (value) => ({
    type: 'SET_SELL_TAGS',
    payload: value,
});

export const setReceiptSelling = (value) => ({
    type: 'SET_RECEIPT_SELLING',
    payload: value,
});

export const setNewProductWindow = (value) => ({
    type: 'SET_NEW_PRODUCT_WINDOW',
    payload: value,
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PRODUCT_LIST':
            return {...state, productList: action.payload};
        case 'SET_RECEIPT_LIST':
            return {...state, receiptList: action.payload};
        case 'SET_TAG_PRESETS':
            return {...state, tagPresets: action.payload};
        case 'SET_BUYING_PRESETS':
            return {...state, buyingPresets: action.payload};
        case 'SET_SELL_TAGS':
            return {...state, sellTags: action.payload};
        case 'SET_RECEIPT_SELLING':
            return {...state, isReceiptSelling: action.payload};
        case 'SET_NEW_PRODUCT_WINDOW':
            return {...state, isNewProductWindow: action.payload};
        default:
            return state;
    }
};

const store = createStore(reducer);

export default store;