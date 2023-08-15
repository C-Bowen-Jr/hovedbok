import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@mui/base/Button';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton } from '@mui/base/MenuButton';
import { MenuItem } from '@mui/base/MenuItem';
import ProductImageGrid from './ProductImageGrid';
import './App.css';
import { setProductList } from './Store';

function App() {

    const VERSION = "0.0.3";

    const productList = useSelector((state) => state.productList);

    const dispatch = useDispatch();

    const newProduct = () => {
        const newItem = {
            img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
            title: 'Breakfast',
        };
        dispatch(setProductList([...productList, newItem]));
    }

    return (
        <>
            <nav>
                <Dropdown>
                    <MenuButton className="menu_button">File</MenuButton>
                    <Menu className="list_box">
                        <MenuItem onClick={newProduct}>New Product</MenuItem>
                        <MenuItem>Exit</MenuItem>
                    </Menu>
                </Dropdown>
                <Dropdown>
                    <MenuButton className="menu_button">Hovedbok</MenuButton>
                    <Menu className="list_box">
                        <MenuItem>About</MenuItem>
                        <MenuItem>Help</MenuItem>
                    </Menu>
                    <div className="menu_spacer"></div>
                </Dropdown>
            </nav>
            <div>
                <Button className="btn bold primary_button">Test Button</Button>
                <Button className="btn secondary_button">Also Button</Button>
            </div>
            <div>
                <Button className="btn bold warning_button">Test Button</Button>
                <Button className="btn bold alert_button">Also Button</Button>
                <Button className="btn">Another</Button>
            </div>
            <div className="product_grid">
                <ProductImageGrid />
            </div>
        </>
    )
}

export default App
