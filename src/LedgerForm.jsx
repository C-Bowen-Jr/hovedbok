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


export default function LedgerForm() {
    const [quantity, setQuantity] = useState("");

    const buyingPresets = useSelector((state) => state.buyingPresets);

    const dispatch = useDispatch();
    const todaysDate = new Date();

    const handleQuantity = (event) => {
        setQuantity(event.target.value);
    };

    const handlePreset = (event) => {
        console.log(event.target.value);
    };

    const handleSearch = () => {
        const res = invoke('query_with', { payload: "WHERE date LIKE '%2023%'" });
        res.then((result) => {
            //setQuantity(result);
            console.log(result);
        });
    };

    const resetForm = () => {
        //
    };

    return (
        <>
            <Box sx={{ padding: "8px " }}>
                <Divider sx={{ marginTop: "16px" }} textAlign="left">Presets</Divider>
                <Select
                    labelId="preset-select-label"
                    id="preset-query"
                    displayEmpty
                    value={""}
                    sx={{ width: "200px" }}
                    onChange={handlePreset}
                >
                    <MenuItem disabled value="">Common Queries</MenuItem>
                    <MenuItem key="30_days" value="30_days" >
                        Earnings:Spendings - 30 Days 
                    </MenuItem>
                    <MenuItem key="this_month" value="this_month" >
                        Earnings:Spendings - This Month 
                    </MenuItem>
                    <MenuItem key="12_months" value="12_months" >
                        Earnings:Spendings - 1 Year 
                    </MenuItem>
                    <MenuItem key="this_year" value="this_year" >
                        Earnings:Spendings - This Year 
                    </MenuItem>
                    <MenuItem key="all_time" value="all_time" >
                        Earnings:Spendings - Career
                    </MenuItem>
                </Select>
            </Box>
            <Box component="form" sx={{ padding: "8px" }}>
                <Divider sx={{ marginTop: "16px" }} textAlign="left">Search Form</Divider>
                <div>
                    Search toggles and fields
                </div>
                {quantity}
            </Box>
            <Box sx={{ alignContent: "right", marginTop: "16px", padding: "8px" }}>
                <Button 
                    disabled={false} 
                    onClick={handleSearch} 
                    className="btn bold">
                        Search
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