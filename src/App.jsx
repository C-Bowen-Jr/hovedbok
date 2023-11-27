import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Toaster } from 'sonner';
import CustomTabPanel from './LabTabs';
import NewProductDialog from './NewProductWindow';
import CompanyInfoDialog from './CompanyInfoWindow';
import './App.css';

function App() {

    const VERSION = "0.0.28";

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

    // TODO: nav display tied to state, tauri = none, browser = display
    return (
        <ThemeProvider theme={theme}>
            <NewProductDialog />
            <CompanyInfoDialog />
            <Toaster richColors/>
            <CustomTabPanel />
            <Box sx={{ height: "32px" }} />
            
        </ThemeProvider>
    )
}

export default App
