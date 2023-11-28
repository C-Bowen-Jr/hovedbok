import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, Divider, Paper, Tab, Tabs } from '@mui/material';
import ProductImageGrid from './ProductImageGrid';
import BuyingForm from './BuyingForm';
import SellingForm from './SellingForm';
import RecieptPanel from './RecieptGrid';
import InfoStack from "./InfoStack";
import { dropReceiptList } from './Store';


function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Box>{children}</Box>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs() {
    const [value, setValue] = React.useState(0);
    const receiptList = useSelector((state) => state.receiptList);
    const currentOrderNumber = useSelector((state) => state.currentOrderNumber);

    const dispatch = useDispatch();

    const handleChange = (event, newValue) => {
        setValue(newValue);
        dispatch(dropReceiptList());
    };

    const handleTest = () => {
        console.log(receiptList);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} component={Paper} elevation={3}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Selling" {...a11yProps(0)} />
                    <Tab label="Buying" {...a11yProps(1)} />
                    <Divider orientation="vertical" flexItem />
                    <InfoStack />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Box className="flex-tab-panel">
                    <div>
                        <Paper className="card" sx={{ width: 800 }} elevation={1}>
                            <SellingForm />
                        </Paper>
                    </div>
                    <div className="reciept-group">
                        <Paper className="card" sx={{ width: 800 }} elevation={1}>
                            <ProductImageGrid />
                        </Paper>
                        <RecieptPanel />
                    </div>
                </Box>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Box className="flex-tab-panel">
                    <div>
                        <Paper className="card" sx={{ width: 800 }} elevation={1}>
                            <BuyingForm />
                        </Paper></div>
                    <div className="reciept-group">
                        <Paper className="card" sx={{ width: 800 }} elevation={1}>

                        </Paper>
                        <RecieptPanel />
                    </div>
                </Box>
            </CustomTabPanel>
        </Box>
    );
}