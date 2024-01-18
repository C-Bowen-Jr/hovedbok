import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@mui/base/Button';
import { Box, TextField, Divider } from '@mui/material';
import { Select, MenuItem } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { invoke } from '@tauri-apps/api/tauri';
import { toast } from 'sonner';
import { formatCurrency, format_date_db } from './utils.js';
import { setDbMetrics } from './Store';


export default function LedgerForm() {
    const [whereStatement, setWhereStatement] = useState("");
    const [isDisabledSearch, setDisabledSearch] = useState(true);
    const dbMetrics = useSelector((state) => state.dbMetrics);

    const dispatch = useDispatch();
    const todaysDate = new Date();
    const dateParts = [...format_date_db(todaysDate).matchAll(/(\d\d\d\d)-(\d|\d\d)-\d|\d\d/g)];

    const handlePreset = (event) => {
        switch (event.target.value) {
            case "30_days":
                setWhereStatement("WHERE julianday('now') - julianday(date) < 31");
                break;
            case "this_month":
                setWhereStatement(`WHERE date LIKE '%${dateParts[0][1]}-${dateParts[0][2]}-%'`);
                break;
            case "12_months":
                setWhereStatement("WHERE julianday('now') - julianday(date) < 366");
                break;
            case "this_year":
                setWhereStatement(`WHERE date LIKE '%${dateParts[0][1]}-%'`);
                break;
            case "all_time":
                setWhereStatement("");
                break;
            default:
                break;
        }
        setDisabledSearch(false);
        //handleSearch();
    };

    const handleSearch = () => {
        const res = invoke('query_with', { payload: whereStatement });
        console.log(whereStatement);
        res.then((result) => {
            dispatch(setDbMetrics(result));
            setDisabledSearch(true);
        });
    };

    const resetForm = () => {
        dispatch(setDbMetrics(dbMetrics.succes = false));
        setDisabledSearch(true);
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
                        30 Days 
                    </MenuItem>
                    <MenuItem key="this_month" value="this_month" >
                        This Month 
                    </MenuItem>
                    <MenuItem key="12_months" value="12_months" >
                        1 Year 
                    </MenuItem>
                    <MenuItem key="this_year" value="this_year" >
                        This Year 
                    </MenuItem>
                    <MenuItem key="all_time" value="all_time" >
                        Career
                    </MenuItem>
                </Select>
            </Box>
            <Box component="form" sx={{ padding: "8px" }}>
                <Divider sx={{ marginTop: "16px" }} textAlign="left">Search Form</Divider>
                <div>
                    <Button onClick={()=> console.log(producList)}>Products</Button>
                </div>
            </Box>
            <Box sx={{ alignContent: "right", marginTop: "16px", padding: "8px" }}>
                <Button 
                    disabled={isDisabledSearch} 
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