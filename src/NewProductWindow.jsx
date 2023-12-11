import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, TextField } from '@mui/material';
import { Dialog, DialogActions, DialogTitle } from '@mui/material';
import { DialogContent, DialogContentText } from '@mui/material';
import { listen } from '@tauri-apps/api/event';
import { format_date } from './utils.js';
import { setNewProductWindow, setProductList, saveFile } from './Store';

export default function NewProductDialog() {
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
        if (event.target.value.length > 2 && !event.target.value.includes(" ")) {
            setBadSku(false);
        } else {
            setBadSku(true);
        }
    };

    const handleProductFilename = (event) => {
        setProductFilename("./products/".concat(event.target.files[0].name));
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

    const resetFields = () => {
        setProductName("");
        setProductSku("");
        setProductVariant("");
        setStockQuantity(0);
        setSoldQuantity(0);
        setReleaseDate(format_date(todaysDate));
        setProductFilename("./products/");
        setBadName(false);
        setBadSku(false);
        setBadReleaseDate(false);
    };

    const handleClose = () => {
        dispatch(setNewProductWindow(false));
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

    const handleAdd = () => {
        const newItem = {
            img: productFilename,
            title: productName,
            variant: productVariant,
            sku: productSku,
            quantity: stockQuantity,
            sold: soldQuantity,
            released: releaseDate,
            retired: false,
        };

        const appendedList = [...productList, newItem];
        const sortedProductList = appendedList.sort((a,b) => a.sku.localeCompare(b.sku));
        dispatch(setProductList(sortedProductList));
        dispatch(saveFile());
        resetFields();
        dispatch(setNewProductWindow(false));
    };

    useEffect(() => {
        listen("menu-event", (e) => {
            if (e.payload == "new-product-event") {
                dispatch(setNewProductWindow(true));
            }
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
                        onDoubleClick={() => setProductName("")}
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
                        onDoubleClick={() => setProductSku("")}
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
                        onDoubleClick={() => setProductVariant("")}
                    />
                    <TextField
                        margin="dense"
                        id="in_stock"
                        label="Current Stock"
                        type="number"
                        variant="standard"
                        value={stockQuantity}
                        onChange={handleStockQuantity}
                        onDoubleClick={() => setStockQuantity("")}
                    />
                    <TextField
                        margin="dense"
                        id="sold"
                        label="Sold"
                        type="number"
                        variant="standard"
                        value={soldQuantity}
                        onChange={handleSoldQuantity}
                        onDoubleClick={() => setSoldQuantity("")}
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
                        onDoubleClick={() => setReleaseDate("")}
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
                <input className="inputs" type="file" accept="image/*" onChange={handleProductFilename} />
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        sx={{ fontWeight: "bold" }}
                        onClick={handleAdd}
                        disabled={isAnyBadInput()}>Add</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}