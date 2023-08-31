import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { TextField, FormControl, useFormControl } from '@mui/material';
import { Button } from '@mui/base/Button';
import Paper from '@mui/material/Paper';
import { formatCurrency } from './utils.js';
import { setReceiptList, setReceiptSelling } from './Store';


export default function BuyingForm() {
    // Localized states for fields, gets compiled to object on submit
    const [quantity, setQuantity] = useState();
    const [name, setName] = useState("");
    const [tags, setTags] = useState("");
    const [cost, setCost] = useState("");

    const receiptList = useSelector((state) => state.receiptList);

    const dispatch = useDispatch();

    const handleQuantity = (event) => {
        setQuantity(event.target.value);
    };

    const handleName = (event) => {
        setName(event.target.value);
    };

    const handleCost = (event) => {
        setCost(event.target.value);
    };

    const handleTags = (event) => {
        setTags(event.target.value);
    };

    const handleCostBlur = (event) => {
        setCost(formatCurrency(event.target.value));
    };

    const handleSubmit = () => {
        if (!/^[1-9]\d*$/.test(document.getElementById("quantity").value)) {
            document.getElementById("quantity").ariaInvalid = "false";
            return;
        }
        handleBuy(name);
    };
    const handleBuy = (name) => {

        const updatedList = new Map(receiptList);
        updatedList.set(name, { myProduct: false, quantity: quantity, cost: cost, tags: tags });
        dispatch(setReceiptList(updatedList));
        dispatch(setReceiptSelling(false));
    };

    return (
        <Box sx={{ padding: "8px" }}>
            <div>
                <TextField
                    required
                    id="quantity"
                    label="Quantity"
                    autoComplete="off"
                    value={quantity}
                    onChange={handleQuantity}
                    onDoubleClick={() => { setQuantity("") }}
                    sx={{ width: 1 / 4, margin: "8px 4px" }}
                />
                <TextField
                    required
                    id="name"
                    label="Name of Purchase"
                    value={name}
                    onChange={handleName}
                    onDoubleClick={() => { setName("") }}
                    sx={{ width: 4 / 6, margin: "8px 4px" }}
                />
            </div>
            <div>
                <TextField
                    required
                    id="cost"
                    label="Cost"
                    autoComplete="off"
                    value={cost}
                    onChange={handleCost}
                    onDoubleClick={() => { setCost("") }}
                    onBlur={handleCostBlur}
                    sx={{ width: 1 / 4, margin: "8px 4px" }}
                />
                <TextField
                    id="tags"
                    label="Tags"
                    helperText="Separate with commas"
                    value={tags}
                    onChange={handleTags}
                    onDoubleClick={() => { setTags("") }}
                    sx={{ width: 4 / 6, margin: "8px 4px" }}
                />
            </div>
            <div><Button onClick={handleSubmit}>Submit</Button></div>
        </Box>
    );
}