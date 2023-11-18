import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, TextField } from '@mui/material';
import { Dialog, DialogActions, DialogTitle } from '@mui/material';
import { DialogContent, DialogContentText } from '@mui/material';
import { listen } from '@tauri-apps/api/event';
import { setCompanyInfo, setCompanyInfoWindow, saveFile } from './Store';

export default function CompanyInfoDialog() {
    const companyInfo = useSelector((state) => state.companyInfo);
    const [companyName, setCompanyName] = companyInfo["name"] == "Company Name" ? useState("") : useState(companyInfo["name"]);
    const [companyAddress, setCompanyAddress] = companyInfo["address"] == "Address line 1" ? useState("") : useState(companyInfo["address"]);
    const [companyUnit, setCompanyUnit] = companyInfo["unit"] == "Address line 2" ? useState("") : useState(companyInfo["unit"]);
    const [companyCity, setCompanyCity] = companyInfo["city"] == "City" ? useState("") : useState(companyInfo["city"]);
    const [companyState, setCompanyState] = companyInfo["state"] == "State" ? useState("") : useState(companyInfo["state"]);
    const [companyZip, setCompanyZip] = companyInfo["zip"] == "12345" ? useState("") : useState(companyInfo["zip"]);
    const [companyURL, setCompanyURL] = companyInfo["url"] == "www.company-website.com" ? useState("") : useState(companyInfo["url"]);
    const [companyLogo, setCompanyLogo] = companyInfo["logo"] == "none" ? useState("./products/") : useState(companyInfo["logo"]);

    const isCompanyInfoWindow = useSelector((state) => state.isCompanyInfoWindow);

    const dispatch = useDispatch();

    const handleCompanyName = (event) => {
        setCompanyName(event.target.value);
    };

    const handleCompanyAddress = (event) => {
        setCompanyAddress(event.target.value);
    };

    const handleCompanyLogo = (event) => {
        setCompanyLogo(companyLogo.concat(event.target.files[0].name));
    };

    const handleCompanyUnit = (event) => {
        setCompanyUnit(event.target.value);
    };

    const handleCompanyCity = (event) => {
        setCompanyCity(event.target.value);
    };

    const handleCompanyState = (event) => {
        setCompanyState(event.target.value);
    };

    const handleCompanyZip = (event) => {
        if (/^\d{0,5}$/.test(event.target.value)) {
            setCompanyZip(event.target.value);
        }
    };

    const handleCompanyURL = (event) => {
        setCompanyURL(event.target.value);
    };

    const handleClose = () => {
        dispatch(setCompanyInfoWindow(false));
    };

    const isAnyBadInput = () => {
        if (companyName == "" || companyAddress == "" || companyLogo == "./products/") {
            return true;
        }
        return false;
    };

    const handleUpdate = () => {
        const newInfo = {
            name: companyName,
            address: companyAddress,
            unit: companyUnit,
            city: companyCity,
            state: companyState,
            zip: companyZip,
            logo: companyLogo,
            url: companyURL,
        };
        dispatch(setCompanyInfo(newInfo));
        dispatch(saveFile());
        dispatch(setCompanyInfoWindow(false));
    };

    useEffect(() => {
        listen("menu-event", (e) => {
            if(e.payload == "edit-company-info") {
                dispatch(setCompanyInfoWindow(true));
            }
        })
    }, []);

    return (
        <>
            <Dialog open={isCompanyInfoWindow} onClose={handleClose}>
                <DialogTitle>Company Info</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Company details for your packing slips
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Company Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={companyName}
                        onChange={handleCompanyName}
                    />
                    <TextField
                        margin="dense"
                        id="address-1"
                        label="Address"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={companyAddress}
                        onChange={handleCompanyAddress}
                    />
                    <TextField
                        margin="dense"
                        id="address-2"
                        label="Unit"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={companyUnit}
                        onChange={handleCompanyUnit}
                    />
                    <TextField
                        margin="dense"
                        id="city"
                        label="City"
                        type="text"
                        variant="standard"
                        value={companyCity}
                        onChange={handleCompanyCity}
                    />
                    <TextField
                        margin="dense"
                        id="state"
                        label="State"
                        type="text"
                        sx={{width: "4ch", marginInline: 4}}
                        inputProps={{maxLength: 2}}
                        variant="standard"
                        value={companyState}
                        onChange={handleCompanyState}
                    />
                    <TextField
                        margin="dense"
                        id="zip"
                        label="Zip Code"
                        type="text"
                        sx={{width: "7ch", marginInline: 0}}
                        variant="standard"
                        value={companyZip}
                        onChange={handleCompanyZip}
                    />
                    <TextField
                        margin="dense"
                        id="url"
                        label="Website"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={companyURL}
                        onChange={handleCompanyURL}
                    />
                    <TextField
                        disabled
                        margin="dense"
                        id="file_name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={companyLogo}
                    />
                </DialogContent>
                <input type="file" accept="image/*" onChange={handleCompanyLogo} />
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        sx={{ fontWeight: "bold" }}
                        onClick={handleUpdate}
                        disabled={isAnyBadInput()}>Update</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}