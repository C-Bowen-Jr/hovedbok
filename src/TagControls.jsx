import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, Button, Switch } from '@mui/material';
import { Select, MenuItem, InputLabel } from '@mui/material';
import { setSellTags, setReceiptSelling } from './Store';


export default function TagControls() {
    // Localized states for fields, gets compiled to object on submit
    const [isTagModeText, setTagModeText] = useState(false);
    const [newTag, setNewTag] = useState("");
    const [badNewTag, setNewBadTag] = useState(false);

    const sellTags = useSelector((state) => state.sellTags);
    const tagPresets = useSelector((state) => state.tagPresets);

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

    const handleTagFromPreset = (event) => {
        if (event.target.value.label) {
            handleUniqueTag(event.target.value.label);
        }
    }

    const handleUniqueTag = (tag) => {
        const addTag = { key: tag, label: tag };
        if (!sellTags.some(addTag => addTag.key == tag)) {
            dispatch(setSellTags([...sellTags, addTag]));
        }
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
                <Button className="btn bold" onClick={handleTagAdd}>Add</Button>
                <Button className="btn bold">Save</Button>
            </>
        );
    }

    return (
        <>
            <Select
                labelId="preset-select-label"
                id="preset-tag"
                value={newTag}
                onChange={handleTagFromPreset}
                sx={{ width: 1/4, margin: "8px 4px" }}
            >
                {Array.from(tagPresets).map((data) => (
                    <MenuItem key={data.key} value={{data}} >
                        {data.label}
                    </MenuItem>
                ))}
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