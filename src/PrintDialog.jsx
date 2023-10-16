import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createPortal } from 'react-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import PackingSlip from './PackingSlip.jsx';
import { setPrintPreview } from './Store';

export default function PrintDialog() {
    const isPrintPreview = useSelector((state) => state.isPrintPreview);
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setPrintPreview(false));
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <Dialog
            open={isPrintPreview}
            onClose={handleClose}
            aria-labelledby="print-dialog-title"
        >
            <DialogTitle id="Print-dialog-title">
                {"Print Packing Slip"}
            </DialogTitle>

            <PackingSlip />

            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                <Button onClick={handlePrint} autoFocus>
                    Print
                </Button>
            </DialogActions>
        </Dialog>
    );
}