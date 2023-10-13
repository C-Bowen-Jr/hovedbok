import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { setPrintPreview } from './Store';

export default function PrintDialog() {
    const isPrintPreview = useSelector((state) => state.isPrintPreview);
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setPrintPreview(false));
    };

    return (
        <div>
            <Dialog
                open={isPrintPreview}
                onClose={handleClose}
                aria-labelledby="print-dialog-title"
            >
                <DialogTitle id="Print-dialog-title">
                    {"Print Packing Slip"}
                </DialogTitle>

                <iframe></iframe>

                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={handleClose} autoFocus>
                        Print
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}