import { createStore } from 'redux';
import { invoke } from '@tauri-apps/api/tauri';
import { toast } from 'sonner';
import jsonFile from './data.json';

const initialState = {
    productList: jsonFile.products,
    receiptList: new Map(),
    tagPresets: jsonFile.tag_presets,
    buyingPresets: jsonFile.buying_presets,
    companyInfo: jsonFile.company_info,
    sellTags: [],
    currentOrderNumber: 1,
    currentPurchaseNumber: 1,
    isReceiptSelling: true,
    isNewProductWindow: false,
    isPrintPreview: false,
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

export const setPrintPreview = (value) => ({
    type: 'SET_PRINT_PREVIEW',
    payload: value,
});

export const setCurrentOrderNumber = (value) => ({
    type: 'SET_CURRENT_ORDER_NUMBER',
    payload: value,
});

export const setCurrentPurchaseNumber = (value) => ({
    type: 'SET_CURRENT_PURCHASE_NUMBER',
    payload: value,
});

export const dropReceiptList = () => ({
    type: 'DROP_RECEIPT_LIST',
    payload: undefined,
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
        case 'SET_PRINT_PREVIEW':
                return {...state, isPrintPreview: action.payload};
        case 'SET_CURRENT_ORDER_NUMBER':
            return {...state, currentOrderNumber: action.payload};
        case 'SET_CURRENT_PURCHASE_NUMBER':
            return {...state, currentPurchaseNumber: action.payload};
        case 'DROP_RECEIPT_LIST':
        {
            Array.from(state.receiptList).map((item) => (
                state.productList.map((products) => (
                    item[0] == products.sku ? products.quantity += item[1].quantity : undefined
                ))
            ))
            const updatedList = new Map();
            return {...state, receiptList: updatedList}
        }
        case 'SAVE_FILE':
        { 
            var updatedJson = jsonFile;
            updatedJson["products"] = state.productList;
            updatedJson["tag_presets"] = state.tagPresets;
            updatedJson["buying_presets"] = state.buyingPresets;
            const res = invoke('update_save_file', {payload: JSON.stringify(updatedJson)});
            toast.promise(res, {
                loading: 'Saving...',
                success: 'Save Succesful',
                error: 'Failed to save',
            });
            //(res) && toast.success("Save successful");
            //(!res) && toast.error("Save failed!");
            return state; 
        }
        default:
            return state;
    }
};

const store = createStore(reducer);

export default store;