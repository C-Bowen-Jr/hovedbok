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
    const [badQuantity, setBadQuantity] = useState(false);
    const [badName, setBadName] = useState(false);
    const [badCost, setBadCost] = useState(false);

    const receiptList = useSelector((state) => state.receiptList);

    const dispatch = useDispatch();

    const handleQuantity = (event) => {
        setQuantity(event.target.value);
        if(/^[1-9]\d*$/.test(event.target.value)) {
            setBadQuantity(false);
        } else {
            setBadQuantity(true);
        }
    };

    const handleName = (event) => {
        setName(event.target.value);
        if(event.target.value.length > 2) {
            setBadName(false);
        } else {
            setBadName(true);
        }
    };

    const handleCost = (event) => {
        setCost(event.target.value);
        if(/^\d*.[0-9][0-9]$/.test(event.target.value)) {
            setBadCost(false);
        } else {
            setBadCost(true);
        }
    };

    const handleTags = (event) => {
        setTags(event.target.value);
    };

    const handleCostBlur = (event) => {
        const formattedCost = formatCurrency(event.target.value);
        if (formattedCost === "NaN") {
            setCost("");
        } else {
            setCost(formattedCost);
            handleCost(event);
        }
    };

    const anyBadInput = () => {
        // If any required field is failing
        if (badQuantity || badName || badCost) {
            return true;
        }
        if (quantity == "" || name == "" || cost == "") {
            return true;
        }
        return false;
    };
    const handleSubmit = () => {
        handleBuy(name);
    };
    const handleBuy = (name) => {

        const updatedList = new Map(receiptList);
        updatedList.set(name, { myProduct: false, quantity: quantity, cost: cost, tags: tags });
        dispatch(setReceiptList(updatedList));
        dispatch(setReceiptSelling(false));
    };

    return (
        <Box component="form" sx={{ padding: "8px" }}>
            <div>
                <TextField
                    required
                    id="quantity"
                    label="Quantity"
                    autoComplete="off"
                    type="text"
                    value={quantity}
                    onChange={handleQuantity}
                    error={badQuantity}
                    onDoubleClick={() => { setQuantity("") }}
                    sx={{ width: 1 / 4, margin: "8px 4px" }}
                />
                <TextField
                    required
                    id="name"
                    label="Name of Purchase"
                    value={name}
                    onChange={handleName}
                    error={badName}
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
                    error={badCost}
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
            <div><Button disabled={anyBadInput()} onClick={handleSubmit}>Submit</Button></div>
        </Box>
    );
}