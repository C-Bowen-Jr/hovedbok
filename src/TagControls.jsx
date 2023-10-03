import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, Switch, Box } from '@mui/material';
import { Select, MenuItem, Typography } from '@mui/material';
import { setSellTags, setTagPresets, saveFile } from './Store';

export default function TagControls() {
    // Localized states for fields, gets compiled to object on submit
    const [isTagModeText, setTagModeText] = useState(false);
    const [newTag, setNewTag] = useState("");
    const [badNewTag, setBadNewTag] = useState(false);

    const sellTags = useSelector((state) => state.sellTags);
    const tagPresets = useSelector((state) => state.tagPresets);

    const dispatch = useDispatch();

    const handleNewTag = (event) => {
        setNewTag(event.target.value);
        setBadNewTag(false);
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

    const handleSave = () => {
        const addTag = { key: newTag, label: newTag };
        if(!tagPresets.some(addTag => addTag.key  == newTag)) {
            dispatch(setTagPresets([...tagPresets, addTag]));
            dispatch(saveFile());
        }
        else {
            setBadNewTag(true);
        }
    };
    
    const isTagAddable = () => {
        const addTag = { key: newTag, label: newTag };
        if (newTag === "" || sellTags.some(addTag => addTag.key == newTag)) {
            return true;
        }
        return false;
    };

    const isTagSavable = () => {
        if (newTag === "" || tagPresets.some(addTag => addTag.key == newTag)) {
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
                    sx={{ width: 2/5, margin: "8px 4px" }}
                />
                <Box sx={{ width: 1, marginInline: "8px" }}>
                    Saved
                    <Switch
                        checked={isTagModeText}
                        onChange={handleTagMode}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <Typography sx={{ display: "inline", fontWeight: "bold", color: "primary.main"}}>Manual</Typography>
                    <button 
                        className="mini_button" 
                        onClick={handleTagAdd}
                        disabled={isTagAddable()}>Add
                    </button>
                    <button 
                        className="mini_button" 
                        onClick={handleSave}
                        disabled={isTagSavable()}>Save
                    </button>
                </Box>
            </>
        );
    }

    return (
        <>
            <Select
                labelId="preset-select-label"
                id="preset-tag"
                value={newTag}
                displayEmpty
                onChange={handleTagFromPreset}
                sx={{ width: 2/5, margin: "8px 4px" }}
            >
                <MenuItem disabled value="">Saved Tags</MenuItem>
                {Array.from(tagPresets).map((data) => (
                    <MenuItem key={data.key} value={data} >
                        {data.label}
                    </MenuItem>
                ))}
            </Select>
            <Box sx={{ width: 1, marginInline: "8px" }}>
                <Typography sx={{ display: "inline", fontWeight: "bold", color: "primary.main"}}>Saved</Typography>
                <Switch
                    checked={isTagModeText}
                    onChange={handleTagMode}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
                Manual
            </Box>
        </>
    );
}