import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Paper, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { invoke } from '@tauri-apps/api/tauri';
import { setCurrentOrderNumber } from './Store';
import { format_date } from './utils.js';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function InfoStack() {
    const todaysDate = new Date();
    const currentOrderNumber = useSelector((state) => state.currentOrderNumber);

    const dispatch = useDispatch();

    useEffect(() => {
        invoke('get_last_order_number')
            .then(last => (last > 0) ? dispatch(setCurrentOrderNumber(last + 1)) : dispatch(setCurrentOrderNumber(1)))
            .catch(err => dispatch(setCurrentOrderNumber("?")));
    }, []);

    return (
        <div style={{ margin: "6px" }}>
            <Stack direction="row" spacing={1}>
                <Item>{ format_date(todaysDate) }</Item>
                <Item>Order: {currentOrderNumber}</Item>
            </Stack>
        </div>
    );
}