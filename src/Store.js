import { createStore } from 'redux';
import { invoke } from '@tauri-apps/api/tauri';
import jsonFile from '../public/data.json';

const initialState = {
    productList: jsonFile.products,
    receiptList: new Map(),
    tagPresets: jsonFile.tag_presets,
    buyingPresets: jsonFile.buying_presets,
    sellTags: [],
    currentOrderNumber: 1,
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

export const saveFile = () => ({
    type: 'SAVE_FILE',
    payload: undefined,
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
        case 'SAVE_FILE':
        { 
            var updatedJson = jsonFile;
            updatedJson["products"] = state.productList;
            updatedJson["tag_presets"] = state.tagPresets;
            updatedJson["buying_presets"] = state.buyingPresets;
            invoke('update_save_file', {payload: JSON.stringify(updatedJson)});
            return state; 
        }
        default:
            return state;
    }
};

const store = createStore(reducer);

export default store;