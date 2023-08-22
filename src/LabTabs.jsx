import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@mui/base/Button';
import Paper from '@mui/material/Paper';
import ProductImageGrid from './ProductImageGrid';
import { setReceiptList } from './Store';


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
                    <Typography>{children}</Typography>
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

    const dispatch = useDispatch();

    const handleChange = (event, newValue) => {
        setValue(newValue);
        const updateState = [];
        dispatch(setReceiptList(updateState));
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} component={Paper} elevation={3}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Selling" {...a11yProps(0)} />
                    <Tab label="Buying" {...a11yProps(1)} />
                    <Tab label="Playground" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Paper className="grid" sx={{maxWidth: "800px"}} elevation={1}>
                    <ProductImageGrid />
                </Paper>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Paper sx={{ maxWidth: "800px", padding: '10px'}}>Item Two</Paper>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <div>
                    <Button className="btn bold primary_button">Test Button</Button>
                    <Button className="btn secondary_button">Also Button</Button>
                </div>
                <div>
                    <Button className="btn bold warning_button">Test Button</Button>
                    <Button className="btn bold alert_button">Also Button</Button>
                    <Button className="btn">Another</Button>
                </div>
            </CustomTabPanel>
        </Box>
    );
}