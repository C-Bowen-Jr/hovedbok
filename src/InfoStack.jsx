import React from 'react';
import { useSelector } from 'react-redux';
import { Paper, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
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
    return (
        <div style={{ margin: "6px" }}>
            <Stack direction="row" spacing={1}>
                <Item>{ format_date(todaysDate) }</Item>
                <Item>Order: {currentOrderNumber}</Item>
            </Stack>
        </div>
    );
}