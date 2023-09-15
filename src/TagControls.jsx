import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, Button, Switch } from '@mui/material';
import { Select, MenuItem, InputLabel } from '@mui/material';
import { setReceiptList, setReceiptSelling } from './Store';


export default function TagControls() {
    // Localized states for fields, gets compiled to object on submit
    const [isTagModeText, setTagModeText] = useState(false);
    const [newTag, setNewTag] = useState("");
    const [sellTags, setSellTags] = useState([]);
    const [badNewTag, setNewBadTag] = useState(false);

    const receiptList = useSelector((state) => state.receiptList);

    const dispatch = useDispatch();

    const handleNewTag = (event) => {
        setNewTag(event.target.value);
    };

    const handleTagAdd = () => {
        if (newTag) {
            handleUniqueTag(newTag);
            setNewTag("");
        }
    };

    const handleUniqueTag = (tag) => {
        if (!sellTags.includes(tag)) {
            setSellTags([...sellTags, tag]);
        }
    };

    const handleRemoveTag = (tag) => {
        const newList = sellTags.filter((checkTag) => checkTag !== tag);
        setSellTags(newList);
    };

    const handleTagMode = (event) => {
        setTagModeText(event.target.checked);
    };

    const isAnyBadInput = () => {
        // If any required field is failing
        if (badNewTag) {
            return true;
        }
        if (newTag == "") {
            return true;
        }
        return false;
    };

    if (isTagModeText) {
        return (
            <>
                <TextField
                    required
                    id="new_tag"
                    label="New Tag"
                    autoComplete="off"
                    type="text"
                    value={newTag}
                    onChange={handleNewTag}
                    error={badNewTag}
                    onDoubleClick={() => { setNewTag("") }}
                    sx={{ width: 1 / 4, margin: "8px 4px" }}
                />
                <Switch
                    checked={isTagModeText}
                    onChange={handleTagMode}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
                <Button className="btn bold">Add</Button>
            </>
        );
    }

    return (
        <>
            <Select
                labelId="preset-select-label"
                id="preset-tag"
                value={"Tag"}
                sx={{ width: 1/4, margin: "8px 4px" }}
            >
                <MenuItem>
                    Test 1
                </MenuItem>
                <MenuItem>
                    Test 2
                </MenuItem>
            </Select>
            <Switch
                checked={isTagModeText}
                onChange={handleTagMode}
                inputProps={{ 'aria-label': 'controlled' }}
            />
            <Button className="btn bold">Add</Button>
            <Button className="btn bold">Remove</Button>
        </>
    );
}