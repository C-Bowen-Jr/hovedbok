import { useState } from 'react';
import { Button } from '@mui/base/Button';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton } from '@mui/base/MenuButton';
import { MenuItem } from '@mui/base/MenuItem';
import ProductImageGrid from './ProductImageGrid';
import './App.css';

function App() {
    const [count, setCount] = useState(0);

    return (
    <>
    <nav>
      <Dropdown>
        <MenuButton className="menu_button">File</MenuButton>
        <Menu className="list_box">
          <MenuItem>New Product</MenuItem>
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
            <ProductImageGrid/>
        </div>
    </>
    )
}

export default App
