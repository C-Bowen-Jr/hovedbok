import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import { setPrintPreview } from './Store';

export default function PrintDialog() {
    const isPrintPreview = useSelector((state) => state.isPrintPreview);
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setPrintPreview(false));
    };

    return (
        <div>
            <h2>Hello</h2>
            <p>This is the packing slip portal</p>
            <button>I don't click</button>
        </div>
    );
}