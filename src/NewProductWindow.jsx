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
import { setNewProductWindow } from './Store';

export default function NewProductDialog() {
    const [productName, setProductName] = useState("");
    const [productFilename, setProductFilename] = useState("");

    const isNewProductWindow = useSelector((state) => state.isNewProductWindow);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setNewProductWindow(false));
        console.log(productFilename);
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
                        value={productName}
                    />
                </DialogContent>
                <input type="file" value={productFilename} />
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button sx={{fontWeight: "bold" }} onClick={handleClose}>Add</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}