import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, TextField } from '@mui/material';
import { Dialog, DialogActions, DialogTitle } from '@mui/material';
import { DialogContent, DialogContentText } from '@mui/material';
import { listen } from '@tauri-apps/api/event';
import { setNewProductWindow, setProductList, saveFile } from './Store';

export default function NewProductDialog() {
    const [productName, setProductName] = useState("");
    const [productSku, setProductSku] = useState("");
    const [productVariant, setProductVariant] = useState("");
    const [productFilename, setProductFilename] = useState("./products/");
    const [isBadName, setBadName] = useState(false);
    const [isBadSku, setBadSku] = useState(false);

    const productList = useSelector((state) => state.productList);
    const isNewProductWindow = useSelector((state) => state.isNewProductWindow);

    const dispatch = useDispatch();

    const handleProductName = (event) => {
        setProductName(event.target.value);
        if (event.target.value.length > 2) {
            setBadName(false);
        } else {
            setBadName(true);
        }
    };

    const handleProductSku = (event) => {
        setProductSku(event.target.value);
        if(event.target.value.length > 2 && !event.target.value.includes(" ")) {
            setBadSku(false);
        } else {
            setBadSku(true);
        }
    };

    const handleProductFilename = (event) => {
        setProductFilename(productFilename.concat(event.target.files[0].name));
    };

    const handleProductVariant = (event) => {
        setProductVariant(event.target.value);
    };

    const handleClose = () => {
        dispatch(setNewProductWindow(false));
    };
    
    const handleAdd = () => {
        if (productName != "" && !isBadName && productSku != "" && !isBadSku && productFilename != "./products/") {
            const newItem = {
                img: productFilename,
                title: productName,
                variant: productVariant,
                sku: productSku
            };
            dispatch(setProductList([...productList, newItem]));
            dispatch(saveFile());
            dispatch(setNewProductWindow(false));
        }
    };

    useEffect(() => {
        listen("menu-event", (e) => {
          dispatch(setNewProductWindow(true));
        })
    }, []);

    return (
        <>
            <Dialog open={isNewProductWindow} onClose={handleClose}>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Add a new product here.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="new_name"
                        label="Product Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        error={isBadName}
                        value={productName}
                        onChange={handleProductName}
                    />
                    <TextField
                        margin="dense"
                        id="new_sku"
                        label="Product SKU"
                        type="text"
                        fullWidth
                        variant="standard"
                        error={isBadSku}
                        value={productSku}
                        onChange={handleProductSku}
                    />
                    <TextField
                        margin="dense"
                        id="new_variant"
                        label="Product Variant"
                        placeholder="Leave blank if none"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={productVariant}
                        onChange={handleProductVariant}
                    />
                    <TextField
                        disabled
                        margin="dense"
                        id="file_name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={productFilename}
                    />
                </DialogContent>
                <input type="file" accept="image/*" onChange={handleProductFilename} />
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button sx={{fontWeight: "bold" }} onClick={handleAdd}>Add</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}