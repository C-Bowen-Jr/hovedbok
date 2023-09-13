import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useFilePicker } from 'react-sage';
import { setNewProductWindow, setProductList } from './Store';

export default function NewProductDialog() {
    const [productName, setProductName] = useState("");
    const [productFilename, setProductFilename] = useState("./products/");
    const [isBadName, setBadName] = useState(false);

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

    const handleProductFilename = (event) => {
        setProductFilename(productFilename.concat(event.target.files[0].name));
    };

    const handleClose = () => {
        dispatch(setNewProductWindow(false));
    };
    
    const handleAdd = () => {
        if (productName != "" && !isBadName && productFilename != "./products/") {
            const newItem = {
                img: productFilename,
                title: productName,
            };
            dispatch(setProductList([...productList, newItem]));
            // TODO: Save productList to json file
            dispatch(setNewProductWindow(false));
        }
    };

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