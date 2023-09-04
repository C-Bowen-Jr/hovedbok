import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { TextField, Divider } from '@mui/material';
import { Button } from '@mui/base/Button';
import { Select, MenuItem, InputLabel } from '@mui/material';
import Paper from '@mui/material/Paper';
import { formatCurrency } from './utils.js';
import { setReceiptList, setReceiptSelling } from './Store';


export default function SellingForm() {
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
        if (/^[1-9]\d*$/.test(event.target.value)) {
            setBadQuantity(false);
        } else {
            setBadQuantity(true);
        }
    };

    const handleName = (event) => {
        setName(event.target.value);
        if (event.target.value.length > 2) {
            setBadName(false);
        } else {
            setBadName(true);
        }
    };

    const handleCost = (event) => {
        setCost(event.target.value);
        if (/^\d*.[0-9][0-9]$/.test(event.target.value)) {
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
            event.target.value = formattedCost;
            handleCost(event);
        }
    };

    const isAnyBadInput = () => {
        // If any required field is failing
        if (badQuantity || badName || badCost) {
            return true;
        }
        if (quantity == "" || name == "" || cost == "") {
            return true;
        }
        return false;
    };

    const isNewPreset = () => {
        console.log("TODO BuyingForm.isNewPreset");
        return true;
    }

    const handlePreset = (event) => {
        setQuantity(event.target.value.quantity);
        setName(event.target.value.name);
        setCost(event.target.value.cost);
        setTags(event.target.value.tags);
    };

    const resetForm = () => {
        setQuantity("");
        setName("");
        setCost("");
        setTags("");
        setBadQuantity(false);
        setBadName(false);
        setBadCost(false);
    }

    const handleSubmit = () => {
        handleBuy(name);
    };

    const handleBuy = (name) => {

        const updatedList = new Map(receiptList);
        updatedList.set(name, { myProduct: false, quantity: quantity, cost: cost, tags: tags });
        dispatch(setReceiptList(updatedList));
        dispatch(setReceiptSelling(false));
        resetForm();
    };

    return (
        <>
            <Box sx={{ padding: "8px " }}>
                <Divider sx={{ marginTop: "16px" }} textAlign="left">Presets</Divider>
                <InputLabel id="preset-select-label">Presets</InputLabel>
                <Select
                    labelId="preset-select-label"
                    id="preset-purchase"
                    label="Presets"
                    value={""}
                    sx={{ width: "200px" }}
                    onChange={handlePreset}
                >
                    <MenuItem value={{ quantity: "", name: "Test 1", cost: "", tags: "operations" }}>
                        Test 1
                    </MenuItem>
                    <MenuItem value={{ quantity: "1", name: "Test 2", cost: "3.33", tags: "operations" }}>
                        Test 2
                    </MenuItem>
                </Select>
                <Button className="btn bold">Hosting</Button>
                <Button className="btn bold">Payroll</Button>
            </Box>
            <Box component="form" sx={{ padding: "8px" }}>
                <Divider sx={{ marginTop: "16px" }} textAlign="left">Purchase Form</Divider>
                <div>
                    <TextField
                        required
                        id="expense"
                        label="Expense"
                        autoComplete="off"
                        type="text"
                        value={quantity}
                        onChange={handleQuantity}
                        error={badQuantity}
                        onDoubleClick={() => { setQuantity("") }}
                        sx={{ width: 4 / 6, margin: "8px 4px" }}
                    />
                </div>
                <div>
                    <TextField
                        required
                        id="earnings"
                        label="Earnings"
                        autoComplete="off"
                        type="text"
                        value={quantity}
                        onChange={handleQuantity}
                        error={badQuantity}
                        onDoubleClick={() => { setQuantity("") }}
                        sx={{ width: 4 / 6, margin: "8px 4px" }}
                    />
                </div>
                <Divider sx={{ marginTop: "16px", textAlign: "left" }}>Seller Fees</Divider>
                <Button>Etsy</Button>
                <Button>PayPal</Button>
                <div>
                <TextField
                        required
                        id="fee"
                        label="Fee"
                        autoComplete="off"
                        type="text"
                        value={quantity}
                        onChange={handleQuantity}
                        error={badQuantity}
                        onDoubleClick={() => { setQuantity("") }}
                        sx={{ width: 4 / 6, margin: "8px 4px" }}
                    />
                </div>
                <Divider sx={{ marginTop: "16px", textAlign: "left" }}>Tags</Divider>
                <InputLabel id="preset-select-label">Presets</InputLabel>
                <Select
                    labelId="preset-select-label"
                    id="preset-tag"
                    label="Presets"
                    value={""}
                    sx={{ width: "200px" }}
                    onChange={handlePreset}
                >
                    <MenuItem value={{ quantity: "", name: "Test 1", cost: "", tags: "operations" }}>
                        Test 1
                    </MenuItem>
                    <MenuItem value={{ quantity: "1", name: "Test 2", cost: "3.33", tags: "operations" }}>
                        Test 2
                    </MenuItem>
                </Select>
                <Button className="btn bold">Add</Button>
                <Button className="btn bold">Save</Button>
                <Button className="btn bold">Remove</Button>
            </Box>
            <Box sx={{ alignContent: "right", marginTop: "16px", padding:"8px" }}>
                <Button disabled={isAnyBadInput()} onClick={handleSubmit} className="btn bold">Submit</Button>
                <Button onClick={resetForm} className="btn bold">Cancel</Button>
            </Box>
        </>
    );
}

// Ship to
// Expense
// Earnings
// Fee
// [etsy] [paypal]
// Tags
// Tag [add tag]
// Gift Message
// [submit] [clear]