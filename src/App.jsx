import { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton } from '@mui/base/MenuButton';
import Box from '@mui/material/Box';
import CustomTabPanel from './LabTabs';
import CustomizedTables from './RecieptGrid';
import FileMenu from './FileMenu';
import AppMenu from './AppMenu';
import NewProductDialog from './NewProductWindow';
import './App.css';
import { setProductList } from './Store';

function App() {

    const VERSION = "0.0.13";

    const productList = useSelector((state) => state.productList);

    const dispatch = useDispatch();

    const theme = createTheme({
        palette: {
            primary: {
                main: '#1f883d',
            },
            secondary: {
                main: '#6d3770',
            },
            mode: 'dark',
        }
    });

    const newProduct = () => {
        const newItem = {
            img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
            title: 'Breakfast',
        };
        dispatch(setProductList([...productList, newItem]));
    }

    return (
        <ThemeProvider theme={theme}>
            <nav>
                <Dropdown>
                    <MenuButton className="menu_button">File</MenuButton>
                    <Menu>
                        <FileMenu />
                    </Menu>
                </Dropdown>
                <Dropdown>
                    <MenuButton className="menu_button">Hovedbok</MenuButton>
                    <Menu className="list_box">
                        <AppMenu />
                    </Menu>
                    <div className="menu_spacer"></div>
                </Dropdown>
            </nav>
            <NewProductDialog />
            <CustomTabPanel />
            <CustomizedTables />
            <Box sx={{ height: "32px" }} />
            
        </ThemeProvider>
    )
}

export default App
