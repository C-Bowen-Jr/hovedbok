import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

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

function createData(quantity, name, tags, price) {
  return { quantity, name, tags, price };
}

const recieptItems = [
  createData(1, 'Product', 'Etsy,International', 0.00),
];

export default function CustomizedTables() {
  return (
    <TableContainer sx={{ maxWidth: 800, paddingInline: "24px"}}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="right" sx={{width: 1/8}}>Quantity</StyledTableCell>
            <StyledTableCell align="left">Product Name</StyledTableCell>
            <StyledTableCell align="right">Tags</StyledTableCell>
            <StyledTableCell align="right" sx={{width: 1/8}}>Price</StyledTableCell>
            <StyledTableCell align="center" sx={{width: 1/12}}></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recieptItems.map((item) => (
            <StyledTableRow key={item.name}>
              <StyledTableCell align="right" component="th" scope="row">
                {item.quantity}
              </StyledTableCell>
              <StyledTableCell align="left">{item.name}</StyledTableCell>
              <StyledTableCell align="right">{item.tags}</StyledTableCell>
              <StyledTableCell align="right">{item.price}</StyledTableCell>
              <StyledTableCell align="center"><HighlightOffIcon /></StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}