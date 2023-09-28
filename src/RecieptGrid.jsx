import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { styled, Table, TableBody, TableCell, tableCellClasses } from '@mui/material';
import { TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { setReceiptList } from './Store';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));



export default function RecieptPanel() {
    const receiptList = useSelector((state) => state.receiptList);
    const isReceiptSelling = useSelector((state) => state.isReceiptSelling);

    const handleRemoveReceiptItem = (item) => {
        const newList = new Map(
            [...receiptList].filter(([k, v]) => k != item)
        );
        dispatch(setReceiptList(newList));
    };

    const dispatch = useDispatch();
    if (receiptList.size == 0) {
        return (
            <TableContainer sx={{ maxWidth: 800, paddingBottom: "24px" }}>
                <Table aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">Receipt</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    if (isReceiptSelling) // Selling
        return (
            <TableContainer sx={{ maxWidth: 800, paddingBottom: "24px" }}>
                <Table aria-label="customized table" size="small">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="right" sx={{ width: 1 / 8 }}>Quantity</StyledTableCell>
                            <StyledTableCell align="left">Product Name</StyledTableCell>
                            <StyledTableCell align="center" sx={{ width: 1 / 12 }}></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.from(receiptList).map(([name, details]) => (
                            <StyledTableRow key={name} component={Paper} hover sx={{
                                '&:hover': {
                                    boxShadow: "inset 0 0 0 3px green",
                                },
                            }}>
                                <StyledTableCell align="right" component="th" scope="row">
                                    {details.quantity}
                                </StyledTableCell>
                                <StyledTableCell align="left">{name}</StyledTableCell>
                                <StyledTableCell align="center">
                                    <HighlightOffIcon
                                        sx={{
                                            '&:hover': {
                                                '& > path,use': {
                                                    fill: '#f44336',
                                                },
                                            },
                                        }}
                                        onClick={() => { handleRemoveReceiptItem(name) }}
                                    />
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );

    // Implied else
    // Buying
    return (
        <TableContainer sx={{ maxWidth: 800, paddingBottom: "24px" }}>
            <Table aria-label="customized table" size="small">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="right" sx={{ width: 1 / 8 }}>Quantity</StyledTableCell>
                        <StyledTableCell align="left">Product Name</StyledTableCell>
                        <StyledTableCell align="right">Tags</StyledTableCell>
                        <StyledTableCell align="right" sx={{ width: 1 / 8 }}>Cost</StyledTableCell>
                        <StyledTableCell align="center" sx={{ width: 1 / 12 }}></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.from(receiptList).map(([name, details]) => (
                        <StyledTableRow key={name} component={Paper} hover sx={{
                            '&:hover': {
                                boxShadow: "inset 0 0 0 3px green",
                            },
                        }}>
                            <StyledTableCell align="right" component="th" scope="row">
                                {details.quantity}
                            </StyledTableCell>
                            <StyledTableCell align="left">{name}</StyledTableCell>
                            <StyledTableCell align="right">{details.tags}</StyledTableCell>
                            <StyledTableCell align="right">{details.cost}</StyledTableCell>
                            <StyledTableCell align="center">
                                <HighlightOffIcon 
                                    sx={{
                                        '&:hover': {
                                            '& > path,use': {
                                                fill: '#f44336',
                                            },
                                        },
                                    }}
                                    onClick={() => { handleRemoveReceiptItem(name) }}
                                />
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}