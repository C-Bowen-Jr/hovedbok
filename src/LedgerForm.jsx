import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@mui/base/Button';
import { Box, TextField, Divider } from '@mui/material';
import { Select, MenuItem, Switch } from '@mui/material';
import { display } from '@mui/system';
import InputAdornment from '@mui/material/InputAdornment';
import { invoke } from '@tauri-apps/api/tauri';
import { toast } from 'sonner';
import { formatCurrency, format_date_db } from './utils.js';
import { setDbMetrics } from './Store';

function getSuperSkus(list) {
    let superSkus = new Set;

    list.forEach(sku => {
        if (sku.includes('_')) {
            const baseSku = sku.split('_')[0];
            superSkus.add(baseSku + "_*");
        }
        superSkus.add(sku);
    });

    return Array.from(superSkus).sort();
}

export default function LedgerForm() {
    const [whereStatement, setWhereStatement] = useState("");
    const [isDisabledSearch, setDisabledSearch] = useState(true);
    const [item, setItem] = useState("");
    const [salesTag, setSalesTag] = useState("");
    const [purchaseTag, setPurchaseTag] = useState("");
    const [isSummarySearch, setSummarySearch] = useState(false);
    const [isSalesSearch, setSalesSearch] = useState(false);
    const [isPurchaseSearch, setPurchaseSearch] = useState(false);
    const dbMetrics = useSelector((state) => state.dbMetrics);
    const productList = useSelector((state) => state.productList);

    const dispatch = useDispatch();
    const todaysDate = new Date();
    const skuList = getSuperSkus(productList.map((x) => x.sku));
    const dateParts = [...format_date_db(todaysDate).matchAll(/(\d\d\d\d)-(\d\d)-\d\d/g)];

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

    const setSearchToSales = (isSales) => {
        setSalesSearch(isSales);
        setPurchaseSearch(!isSales);
    };

    const handleSku = (event) => {
        const skuUsingPercent = event.target.value.replace("*", "%");
        setSearchToSales(true);
    };

    const handleItem = (event) => {
        setItem(event.target.value);
        if (event.target.value != "") {
            setSearchToSales(false);
        }
        else {
            setSearchToSales(true);
        }
    };

    const handleSalesTag = (event) => {
        setSalesTag(event.target.value);
        if (event.target.value != "") {
            setSearchToSales(true);
        }
        else {
            setSearchToSales(false);
        }
    };

    const handlePurchaseTag = (event) => {
        setPurchaseTag(event.target.value);
        if (event.target.value != "") {
            setSearchToSales(false);
        }
        else {
            setSearchToSales(true);
        }
    };

    const handleSummarySearch = (event) => {
        setSummarySearch(event.target.checked);
    };

    const handleSearch = () => {
        const res = invoke('query_with', { payload: whereStatement });
        res.then((result) => {
            dispatch(setDbMetrics(result));
            setDisabledSearch(true);
        });
    };

    const resetForm = () => {
        setSalesSearch(false);
        setPurchaseSearch(false);
        dispatch(setDbMetrics(dbMetrics.succes = false));
        setDisabledSearch(true);
    };

    return (
        <>
            <Box sx={{ padding: "8px " }}>
                <Divider sx={{ marginTop: "16px" }} textAlign="left">Search Type</Divider>
                <Box sx={{ width: 1, marginInline: "8px" }}>
                    Specifics
                    <Switch
                        checked={isSummarySearch}
                        onChange={handleSummarySearch}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    Summary
                </Box>
            </Box>
            <Box sx={{ padding: "8px " }}>
                <Divider sx={{ marginTop: "16px" }} textAlign="left">Time Frame</Divider>
                <Select
                    labelId="preset-select-label"
                    id="preset-query"
                    displayEmpty
                    value={""}
                    sx={{ width: "200px", margin: "8px 4px" }}
                    onChange={handlePreset}
                >
                    <MenuItem disabled value="">Date Window</MenuItem>
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
            {!isSummarySearch && <>
            <Divider sx={{ marginTop: "16px" }} textAlign="left">Search Item</Divider>
            <Box  sx={{ display: "flex", flexDirection: "row", alignItems: "center", padding: "8px" }}>
                <Select
                    labelId="sku-select-label"
                    id="sku-select"
                    displayEmpty
                    disabled={isPurchaseSearch}
                    value={""}
                    sx={{ width: "200px", margin: "8px 4px" }}
                    onChange={handleSku}
                >
                    <MenuItem disabled value="">SKU</MenuItem>
                    {Array.from(skuList).map((sku) => (
                        <MenuItem key={sku} value={sku} >
                            {sku}
                        </MenuItem>
                    ))}
                </Select>
                <Divider sx={{ margin: "8px", width: "120px"}} textAlign="center">Or</Divider>
                <TextField
                        id="item"
                        label="Item"
                        autoComplete="off"
                        disabled={isSalesSearch}
                        value={item}
                        onChange={handleItem}
                        onDoubleClick={() => { setItem("") }}
                        sx={{ width: "200px", margin: "8px 4px" }}
                    />
            </Box>
            <Divider sx={{ marginTop: "16px" }} textAlign="left">Search Tag</Divider>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", padding: "8px" }}>
                <TextField
                        id="sales-tag"
                        label="Sales Tag"
                        autoComplete="off"
                        disabled={isPurchaseSearch}
                        value={salesTag}
                        onChange={handleSalesTag}
                        onDoubleClick={() => { setSalesTag("") }}
                        sx={{ width: "200px", margin: "8px 4px" }}
                    />
                <Divider sx={{ margin: "8px", width: "120px"}} textAlign="center">Or</Divider>
                <TextField
                        id="purchase-tag"
                        label="Purchase Tag"
                        autoComplete="off"
                        disabled={isSalesSearch}
                        value={purchaseTag}
                        onChange={handlePurchaseTag}
                        onDoubleClick={() => { setPurchaseTag("") }}
                        sx={{ width: "200px", margin: "8px 4px" }}
                    />
            </Box>
            </>}
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