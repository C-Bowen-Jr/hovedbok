import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown, Menu, MenuButton } from '@mui/base';
import Box from '@mui/material/Box';
import { Toaster } from 'sonner';
import CustomTabPanel from './LabTabs';
import FileMenu from './FileMenu';
import AppMenu from './AppMenu';
import NewProductDialog from './NewProductWindow';
import CompanyInfoDialog from './CompanyInfoWindow';
import './App.css';
import { setProductList } from './Store';

function App() {

    const VERSION = "0.0.28";

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

    // TODO: nav display tied to state, tauri = none, browser = display
    return (
        <ThemeProvider theme={theme}>
            <nav style={{display: "none"}}>
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
                </Dropdown>
                <Dropdown>
                    <MenuButton className="menu_button">Order: Connecting...</MenuButton>
                </Dropdown>
            </nav>
            <NewProductDialog />
            <CompanyInfoDialog />
            <Toaster richColors/>
            <CustomTabPanel />
            <Box sx={{ height: "32px" }} />
            
        </ThemeProvider>
    )
}

export default App
