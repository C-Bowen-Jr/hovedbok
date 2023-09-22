import { createStore } from 'redux';
import { invoke } from '@tauri-apps/api/tauri';
import jsonFile from '../public/data.json';

const initialState = {
    productList: jsonFile.products,
    receiptList: new Map(),
    tagPresets: jsonFile.tagPresets,
    buyingPresets: jsonFile.buyingPresets,
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

export const updateSave = () => {
    invoke('update_save_file', {invokeMessage: JSON.stringify(jsonFile)});
};

const store = createStore(reducer);

export default store;