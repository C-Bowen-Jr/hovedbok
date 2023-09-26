import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, TextField, Divider } from '@mui/material';
import { Button } from '@mui/base/Button';
import TagControls from './TagControls.jsx';
import TagDisplay from './TagDisplay.jsx';
import { invoke } from '@tauri-apps/api/tauri';
import { formatCurrency } from './utils.js';
import { setSellTags } from './Store';



export default function SellingForm() {
    // Localized states for fields, gets compiled to object on submit
    const [expense, setExpense] = useState();
    const [earnings, setEarnings] = useState("");
    const [fee, setFee] = useState("");
    const [newTag, setNewTag] = useState("");
    const [badExpense, setBadExpense] = useState(false);
    const [badEarnings, setBadEarnings] = useState(false);
    const [badFee, setBadFee] = useState(false);
    const [isAutoFee, setIsAutoFee] = useState(true);

    const receiptList = useSelector((state) => state.receiptList);
    const sellTags = useSelector((state) => state.sellTags);

    const dispatch = useDispatch();

    const handleExpense = (event) => {
        setExpense(event.target.value);
        if (/^\d+.[0-9][0-9]*$/.test(event.target.value)) {
            setBadExpense(false);
        } else {
            setBadExpense(true);
        }
    };

    const handleEarnings = (event) => {
        setEarnings(event.target.value);
        if (/^\d+.[0-9][0-9]*$/.test(event.target.value)) {
            setBadEarnings(false);
        } else {
            setBadEarnings(true);
        }
    };

    const handleFee = (event) => {
        setFee(event.target.value);
        if (/^\d.[0-9][0-9]*$/.test(event.target.value)) {
            setBadFee(false);
        } else {
            setBadFee(true);
        }
    };

    const handleUniqueTag = (tag) => {
        const addTag = { key: tag, label: tag };
        if (!sellTags.some(addTag => addTag.key == tag)) {
            dispatch(setSellTags([...sellTags, addTag]));
        }
    };

    const handleExpenseBlur = (event) => {
        const formattedCost = formatCurrency(event.target.value);
        if (formattedCost === "NaN") {
            setExpense("");
        } else {
            event.target.value = formattedCost;
            handleExpense(event);
        }
    };

    const handleEarningsBlur = (event) => {
        const formattedCost = formatCurrency(event.target.value);
        if (formattedCost === "NaN") {
            setEarnings("");
        } else {
            event.target.value = formattedCost;
            handleEarnings(event);
        }
    };

    const handleEtsyButton = () => {
        const itemCount = getTotalProductCount();
        invoke('calculate_etsy_fee', {jsEarnings: earnings, jsQuantity: itemCount}).then((result) => setFee(result));
        
        handleUniqueTag("Etsy").then((result) => {
            const newList = sellTags.filter((checkTag) => checkTag.key !== "PayPal");
            dispatch(setSellTags(newList));
        });
    };

    const handlePaypalButton = () => {
        invoke('calculate_paypal_fee', {jsEarnings: earnings}).then((result) => setFee(result));

        handleUniqueTag("PayPal").then((result) => {
            const newList = sellTags.filter((checkTag) => checkTag.key !== "Etsy");
            dispatch(setSellTags(newList));
        });
    };

    const handleFeeBlur = (event) => {
        const formattedCost = formatCurrency(event.target.value);
        if (formattedCost === "NaN") {
            setFee("");
        } else {
            event.target.value = formattedCost;
            handleFee(event);
        }
        setIsAutoFee(true);
    };

    const isFeeNotCalculatable = () => {
        if (badEarnings) {
            return true;
        }
        if (earnings == "" || receiptList.size === 0) {
            return true;
        }
        return false;
    };

    const isAnyBadInput = () => {
        // If any required field is failing
        if (badExpense || badEarnings || badFee) {
            return true;
        }
        if (expense == "" || earnings == "" || fee == "" || receiptList.size === 0) {
            return true;
        }
        return false;
    };

    const handleManualFee = () => {
        setIsAutoFee(false);
        document.getElementById("fee").focus();
    };

    const isNewPreset = () => {
        console.log("TODO SellingForm.isNewPreset");
        return true;
    }

    const getUniqueProductCount = () => {
        return receiptList.length;
    };

    const getTotalProductCount = () => {
        let total = 0;
        const receiptArray = Array.from(receiptList.values())
        receiptArray.forEach((receiptItem) => total += receiptItem.quantity);
        return total;
    };

    const resetForm = () => {
        setExpense("");
        setEarnings("");
        setFee("");
        setTags("");
        setBadExpense(false);
        setBadEarnings(false);
        setBadFee(false);
        setIsAutoFee(true);
    }

    const handleSubmit = () => {
        handleSell();
    };

    /* Example JSON object
   '{
        "order": {
            "date": "2023-10-26",
            "order_number": 1,
            "expense": "3.14",
            "fee": "1.23",
            "earnings": "10.26",
            "tags": "Etsy,Discount",
            "order_line": [
                {
                    "order_number": 1,
                    "sku": "DSCORPS",
                    "quantity": 1,
                }
            ]
        }
    }'

    */

    const handleSell = () => {
        const sellObject = JSON.parse('{"order": "null"}')
    };

    return (
        <>
            <Box component="form" sx={{ padding: "8px" }}>
                <Divider sx={{ marginTop: "16px" }} textAlign="left">Selling Form</Divider>
                <div>
                    <TextField
                        required
                        id="expense"
                        label="Expense"
                        autoComplete="off"
                        type="text"
                        value={expense}
                        onChange={handleExpense}
                        error={badExpense}
                        onBlur={handleExpenseBlur}
                        onDoubleClick={() => { setExpense("") }}
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
                        value={earnings}
                        onChange={handleEarnings}
                        error={badEarnings}
                        onBlur={handleEarningsBlur}
                        onDoubleClick={() => { setEarnings("") }}
                        sx={{ width: 4 / 6, margin: "8px 4px" }}
                    />
                </div>
                <Divider sx={{ marginTop: "16px" }} textAlign="left">Seller Fees</Divider>
                <Button 
                    className="btn bold etsy" 
                    disabled={isFeeNotCalculatable()}
                    onClick={handleEtsyButton}>Etsy</Button>
                <Button 
                    className="btn bold paypal" 
                    disabled={isFeeNotCalculatable()}
                    onClick={handlePaypalButton}>PayPal</Button>
                <Button className="btn bold" onClick={handleManualFee}>Manual</Button>
                <div>
                <TextField
                        required
                        id="fee"
                        label="Fee"
                        autoComplete="off"
                        type="text"
                        value={fee}
                        disabled={isAutoFee}
                        onChange={handleFee}
                        onBlur={handleFeeBlur}
                        error={badFee}
                        onDoubleClick={() => { setFee("") }}
                        sx={{ width: 4 / 6, margin: "8px 4px" }}
                    />
                </div>
                <Divider sx={{ marginTop: "16px" }} textAlign="left">Tags</Divider>
                <TagDisplay />
                <TagControls />
                <Divider sx={{ marginTop: "16px" }} textAlign="left">Packing Slip</Divider>
                <div>
                    <TextField
                        required
                        id="address"
                        label="Address"
                        autoComplete="off"
                        multiline
                        maxRows={5}
                        sx={{ width: 4 / 6, margin: "8px 4px" }}
                    />
                </div>
                <div>
                    <TextField
                        id="gift-message"
                        label="Gift Message"
                        autoComplete="off"
                        multiline
                        maxRows={5}
                        sx={{ width: 4 / 6, margin: "8px 4px" }}
                    />
                </div>
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