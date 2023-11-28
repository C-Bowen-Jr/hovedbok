import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, TextField } from '@mui/material';
import { Dialog, DialogActions, DialogTitle } from '@mui/material';
import { DialogContent, DialogContentText } from '@mui/material';
import { listen } from '@tauri-apps/api/event';
import { format_date } from './utils.js';
import { setEditProductWindow, setProductList, saveFile } from './Store';

export default function EditProductDialog() {
    const todaysDate = new Date();
    const [productName, setProductName] = useState("");
    const [productSku, setProductSku] = useState("");
    const [productVariant, setProductVariant] = useState("");
    const [stockQuantity, setStockQuantity] = useState(0);
    const [soldQuantity, setSoldQuantity] = useState(0);
    const [releaseDate, setReleaseDate] = useState(format_date(todaysDate));
    const [productFilename, setProductFilename] = useState("./products/");
    const [isBadName, setBadName] = useState(false);
    const [isBadSku, setBadSku] = useState(false);
    const [isBadReleaseDate, setBadReleaseDate] = useState(false);

    const productList = useSelector((state) => state.productList);
    const isEditProductWindow = useSelector((state) => state.isEditProductWindow);
    const editSku = useSelector((state) => state.editSku);

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
        if (event.target.value.length > 2 && !event.target.value.includes(" ")) {
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

    const handleStockQuantity = (event) => {
        const value = event.target.value
        if (!isNaN(value) && !isNaN(parseFloat(value)) && value >= 0) {
            setStockQuantity(event.target.value);
        }
    };

    const handleSoldQuantity = (event) => {
        const value = event.target.value
        if (!isNaN(value) && !isNaN(parseFloat(value)) && value >= 0) {
            setSoldQuantity(event.target.value);
        }
    };

    const handleReleaseDate = (event) => {
        setReleaseDate(event.target.value);
        if (/^([1-9]|1[012])[- \/.]([1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d$/.test(event.target.value)) {
            setBadReleaseDate(false);
        } else {
            setBadReleaseDate(true);
        }
    };

    const handleDelete = () => {
        console.log("handleDelete TODO");
    };

    const handleClose = () => {
        dispatch(setEditProductWindow(false));
    };

    const isAnyBadInput = () => {
        // If any required field is failing
        if (isBadName || isBadSku || isBadReleaseDate) {
            return true;
        }
        if (productName == "" || productSku == "" || productFilename == "./products/") {
            return true;
        }
        return false;
    };

    const handleUpdate = () => {
        const newItem = [{
            img: productFilename,
            title: productName,
            variant: productVariant,
            sku: productSku,
            quantity: Number(stockQuantity),
            sold: Number(soldQuantity),
            released: releaseDate,
        }];
        const updatedList = productList.map(prods => newItem.find(newProd => newProd.sku == prods.sku) || prods);
        //dispatch(setProductList([...productList, newItem]));
        dispatch(setProductList(updatedList));
        //dispatch(saveFile());
        dispatch(setEditProductWindow(false));
    };

    useEffect(() => {
        if (editSku != undefined) {
            const oldProduct = productList.filter((product) => product.sku == editSku);

            if (oldProduct.length > 0) {
                setProductName(oldProduct[0].title);
                setProductSku(oldProduct[0].sku);
                setProductVariant(oldProduct[0].variant);
                setProductFilename(oldProduct[0].img);
                setStockQuantity(oldProduct[0].quantity);
                setSoldQuantity(oldProduct[0].sold);
                setReleaseDate(oldProduct[0].released);
                dispatch(setEditProductWindow(true));
            }
        }
    }, [editSku]);

    return (
        <>
            <Dialog open={isEditProductWindow} onClose={handleClose}>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Edit or delte a product.
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
                        disabled
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
                        margin="dense"
                        id="in_stock"
                        label="Current Stock"
                        type="number"
                        variant="standard"
                        value={stockQuantity}
                        onChange={handleStockQuantity}
                    />
                    <TextField
                        margin="dense"
                        id="sold"
                        label="Sold"
                        type="number"
                        variant="standard"
                        value={soldQuantity}
                        onChange={handleSoldQuantity}
                    />
                    <TextField
                        margin="dense"
                        id="release_date"
                        label="release Date"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={releaseDate}
                        error={isBadReleaseDate}
                        onChange={handleReleaseDate}
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
                    <Button onClick={handleDelete}>Delete Product</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        sx={{ fontWeight: "bold" }}
                        onClick={handleUpdate}
                        disabled={isAnyBadInput()}>Update</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}