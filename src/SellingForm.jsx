import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, TextField, Divider } from '@mui/material';
import { Button } from '@mui/base/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TagControls from './TagControls.jsx';
import TagDisplay from './TagDisplay.jsx';
import PrintPreview from './PrintPreview.jsx';
import { invoke } from '@tauri-apps/api/tauri';
import { toast } from 'sonner';
import { formatCurrency, format_date_db } from './utils.js';
import { setSellTags, setCurrentOrderNumber, setProductList, dropReceiptList, saveFile, setReceiptList } from './Store';



export default function SellingForm() {
    // Localized states for fields, gets compiled to object on submit
    const [expense, setExpense] = useState("");
    const [earnings, setEarnings] = useState("");
    const [fee, setFee] = useState("");
    const [address, setAddress] = useState("");
    const [giftMessage, setGiftMessage] = useState("");
    const [logSuccess, setLogSuccess] = useState(false);
    const [badExpense, setBadExpense] = useState(false);
    const [badEarnings, setBadEarnings] = useState(false);
    const [badFee, setBadFee] = useState(false);
    const [badAddress, setBadAddress] = useState(false);
    const [isAutoFee, setIsAutoFee] = useState(true);

    const currentOrderNumber = useSelector((state) => state.currentOrderNumber);
    const receiptList = useSelector((state) => state.receiptList);
    const productList = useSelector((state) => state.productList);
    const sellTags = useSelector((state) => state.sellTags);

    const dispatch = useDispatch();
    const todaysDate = new Date();

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

    const handleAddress = (event) => {
        // Best option would be a free address verify API
        // However, lacking, don't break at fringe cases and allow this
        setAddress(event.target.value);
        if (event.target.value != "") {
            setBadAddress(false);
        } else {
            setBadAddress(true);
        }
    };

    const handleGiftMessage = (event) => {
        setGiftMessage(event.target.value);
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
        invoke('calculate_etsy_fee', { jsEarnings: earnings, jsQuantity: itemCount })
            .then((result) => setFee(result.replace("$","")));

        handleUniqueTag("Etsy").then((result) => {
            const newList = sellTags.filter((checkTag) => checkTag.key !== "PayPal");
            dispatch(setSellTags(newList));
        });
    };

    const handlePaypalButton = () => {
        invoke('calculate_paypal_fee', { jsEarnings: earnings })
            .then((result) => setFee(result.replace("$","")));

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
        if (badExpense || badEarnings || badFee || badAddress) {
            return true;
        }
        // If any field is null (which is a valid state, so not badFlag)
        if (expense == "" || earnings == "" || fee == "" || address == "" || receiptList.size === 0) {
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

    const generalReset = () => {
        setExpense("");
        setEarnings("");
        setFee("");
        setAddress("");
        setGiftMessage("");
        dispatch(setSellTags([]));
        setLogSuccess(false);
        setBadExpense(false);
        setBadEarnings(false);
        setBadFee(false);
        setIsAutoFee(true);
        setBadAddress(false);
    };
    const clearForm = () => {
        generalReset();
        // Empty receiptList and keep stock removed
        const updatedList = new Map();
        dispatch(setReceiptList(updatedList));
    }
    const resetForm = () => {
        generalReset();
        // Empty receiptList and return stock
        dispatch(dropReceiptList());
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
        const rawTags = Array.from(sellTags, (entry) => entry.label);
        const orderLines = Array.from(receiptList).map(([sku, details]) => (
            {
                "order_number": currentOrderNumber,
                "sku": sku,
                "quantity": details.quantity
            }
        ));

        const sellObject = {
            "order": {
                "date": format_date_db(todaysDate),
                "order_number": currentOrderNumber,
                "expense": expense,
                "fee": fee,
                "earnings": earnings,
                "tags": rawTags.join(),
                "order_lines": orderLines
            }
        };
        const res = invoke('publish_sale', { payload: JSON.stringify(sellObject["order"]) });
        res.then((isSuccessful) => {
            if (isSuccessful) {
                toast.success("Ledger appended");
                Array.from(receiptList).map(([sku, details]) => (
                    productList.map((item) => {
                        if (item.sku == sku) {
                            item.sold += details.quantity;
                            item.quantity -+ details.quantity;
                        }
                    })
                ));
                const updatedList = productList;
                dispatch(setProductList(updatedList));
                dispatch(saveFile());
                setLogSuccess(true);
                invoke('get_last_order_number')
            .then(last => (last > 0) ? dispatch(setCurrentOrderNumber(last + 1)) : dispatch(setCurrentOrderNumber(1)))
            .catch(err => {
                dispatch(setCurrentOrderNumber("?"));
                //setLogSuccess(false);
            });
            }
            else {
                toast.error("Failed to append");
            }
        });
        // Defunct, another action on success needed. might as well put everything
        // Assume true, then return to false if fail. easier this way with inline-if
        //setLogSuccess(true);
        
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
                        InputProps={expense != "" ? {
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          } : {}}
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
                        InputProps={earnings != "" ? {
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          } : {}}
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
                        InputProps={fee != "" ? {
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          } : {}}
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
                        value={address}
                        onChange={handleAddress}
                        error={badAddress}
                        onDoubleClick={() => { setAddress("") }}
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
                        value={giftMessage}
                        onChange={handleGiftMessage}
                        onDoubleClick={() => { setGiftMessage("") }}
                        sx={{ width: 4 / 6, margin: "8px 4px" }}
                    />
                </div>
            </Box>
            <Box sx={{ alignContent: "right", marginTop: "16px", padding: "8px" }}>
                <PrintPreview disabled={isAnyBadInput()} address={address}/>
                {!logSuccess &&
                <Button disabled={isAnyBadInput()} onClick={handleSubmit} className="btn bold">Submit</Button>
                }
                {logSuccess &&
                <Button onClick={clearForm} className="btn bold">Clear</Button>
                }
                <Button onClick={resetForm} className="btn bold">Cancel</Button>
            </Box>
        </>
    );
}