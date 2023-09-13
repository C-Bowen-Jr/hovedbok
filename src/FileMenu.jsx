import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import AddIcon from '@mui/icons-material/ControlPoint';
import EditIcon from '@mui/icons-material/Edit';
import ExitAppIcon from '@mui/icons-material/ExitToApp';
import NewProductDialog from './NewProductWindow';
import { setNewProductWindow } from './Store';

export default function FileMenu() {
    const dispatch = useDispatch();

    const handleNewProduct = () => {
        dispatch(setNewProductWindow(true));
    }
    return (
        <Paper sx={{ width: 320, maxWidth: '100%', border: 1.5, borderColor: "#888888" }}>
            <MenuList>
                <MenuItem>
                    <ListItemIcon>
                        <AddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText onClick={handleNewProduct}>Add New Product</ListItemText>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit Product</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem>
                    <ListItemIcon>
                        <ExitAppIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Exit</ListItemText>
                </MenuItem>
            </MenuList>
        </Paper>
    );
}