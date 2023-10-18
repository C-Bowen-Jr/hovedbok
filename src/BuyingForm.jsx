import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@mui/base/Button';
import { Box, TextField, Divider } from '@mui/material';
import { Select, MenuItem } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { invoke } from '@tauri-apps/api/tauri';
import { toast } from 'sonner';
import { formatCurrency, format_date_db } from './utils.js';
import { setReceiptList, setReceiptSelling, setBuyingPresets, saveFile, setCurrentPurchaseNumber } from './Store';


export default function BuyingForm() {
    // Localized states for fields, gets compiled to object on submit
    const [quantity, setQuantity] = useState();
    const [name, setName] = useState("");
    const [tags, setTags] = useState("");
    const [cost, setCost] = useState("");
    const [logSuccess, setLogSuccess] = useState(false);
    const [badQuantity, setBadQuantity] = useState(false);
    const [badName, setBadName] = useState(false);
    const [badCost, setBadCost] = useState(false);

    const currentPurchaseNumber = useSelector((state) => state.currentPurchaseNumber);
    const receiptList = useSelector((state) => state.receiptList);
    const buyingPresets = useSelector((state) => state.buyingPresets);

    const dispatch = useDispatch();
    const todaysDate = new Date();

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

    const isNotNamed = () => {
        if (name === "") {
            return true;
        }
        return false;
    };

    const isHostingMissing = () => {
        // Depending on how user prefers, may be name or tag
        if (buyingPresets.some(check => check.name.toLowerCase() == "hosting")) {
            return false;
        }
        if (buyingPresets.some(check => check.tags.toLowerCase() == "hosting")) {
            return false;
        }
        return true;
    };

    const isPayrollMissing = () => {
        // Depending on how user prefers, may be name or tag
        if (buyingPresets.some(check => check.name.toLowerCase() == "payroll")) {
            return false;
        }
        if (buyingPresets.some(check => check.tags.toLowerCase() == "payroll")) {
            return false;
        }
        return true;
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
        handleBuy();
    };

    const handleSave = () => {
        var buildInclude = "["
        buildInclude += (quantity === "") ? "\u2800" : "#";
        buildInclude += (cost === "") ? "\u2800" : "$";
        buildInclude += "\u{1f9fe}";
        buildInclude += (tags === "") ? "\u2800]" : "\u{1f3f7}]";
        const newPreset = { quantity: quantity, name: name, cost: cost, tags: tags, includes: buildInclude};
        
        dispatch(setBuyingPresets([...buyingPresets, newPreset]));
        dispatch(saveFile());
    };

    const handleAdd = () => {
        const updatedList = new Map(receiptList);
        updatedList.set(name, { myProduct: false, quantity: quantity, cost: cost, tags: tags });
        dispatch(setReceiptList(updatedList));
        dispatch(setReceiptSelling(false));
        resetForm();
    };

    const handleBuy = () => {
        const purchaseLines = Array.from(receiptList).map(([name, details]) => (
            {
                "purchase_number": currentPurchaseNumber,
                "item": name,
                "quantity": Number(details.quantity),
                "expense": details.cost,
                "tags": details.tags
            }
        ));

        const buyObject = {
            "purchase": {
                "date": format_date_db(todaysDate),
                "purchase_number": currentPurchaseNumber,
                "purchase_lines": purchaseLines
            }
        };
        const res = invoke('publish_purchase', { payload: JSON.stringify(buyObject["purchase"]) });
        res.then((isSuccessful) => {
            console.log(res, isSuccessful);
            (isSuccessful) ? toast.success("Ledger appended") : toast.error("Failed to append");
        });
        // Assume true, then return to false if fail. easier this way with inline-if
        setLogSuccess(true);
        invoke('get_last_purchase_number')
            .then(last => (last > 0) ? dispatch(setCurrentPurchaseNumber(last + 1)) : dispatch(setCurrentPurchaseNumber(1)))
            .catch(err => {
                dispatch(setCurrentPurchaseNumber("?"));
                setLogSuccess(false);
            });
    };

    return (
        <>
            <Box sx={{ padding: "8px " }}>
                <Divider sx={{ marginTop: "16px" }} textAlign="left">Presets</Divider>
                <Select
                    labelId="preset-select-label"
                    id="preset-purchase"
                    displayEmpty
                    value={""}
                    sx={{ width: "200px" }}
                    onChange={handlePreset}
                >
                    <MenuItem disabled value="">Saved Items</MenuItem>
                    {Array.from(buyingPresets).map((data) => (
                        <MenuItem key={data.name} value={data} >
                            {data.includes} {data.name}
                        </MenuItem>
                    ))}
                </Select>

                <Button 
                    disabled={isHostingMissing()} 
                    className="btn bold">
                        Hosting
                </Button>
                <Button 
                    disabled={isPayrollMissing()} 
                    className="btn bold">
                        Payroll
                </Button>
            </Box>
            <Box component="form" sx={{ padding: "8px" }}>
                <Divider sx={{ marginTop: "16px" }} textAlign="left">Purchase Form</Divider>
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
                        InputProps={cost != "" ? {
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          } : {}}
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
            </Box>
            <Box sx={{ alignContent: "right", marginTop: "16px", padding: "8px" }}>
                <Button 
                    disabled={isAnyBadInput()} 
                    onClick={handleAdd} 
                    className="btn bold">
                        Add
                </Button>
                <Button 
                    disabled={receiptList.size > 1} 
                    onClick={handleSubmit} 
                    className="btn bold">
                        Submit
                </Button>
                <Button 
                    disabled={isNotNamed() && isNewPreset()} 
                    onClick={handleSave} 
                    className="btn bold">
                        Save
                </Button>
                <Button 
                    onClick={resetForm} 
                    className="btn bold">
                        Cancel
                </Button>
            </Box>
        </>
    );
}