import * as React from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Typography from "@mui/material/Typography";
import TableRow from "@mui/material/TableRow";
import { formatCurrency, format_date_db } from "./utils.js";
import { PieChart } from '@mui/x-charts/PieChart';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function MetricTable() {
  const dbMetrics = useSelector((state) => state.dbMetrics);
  const dbSalesEarnings = formatCurrency(dbMetrics["sales"]["earnings"]);
  const dbSalesExpenses = formatCurrency(dbMetrics["sales"]["expenses"]);
  const dbSalesFees = formatCurrency(dbMetrics["sales"]["fees"]);
  const calcSalesCombinedExpenseFees = formatCurrency(
    dbSalesExpenses + dbSalesFees
  );
  const dbSalesOrders = dbMetrics["sales"]["orders"];
  const dbSalesItems = dbMetrics["sales"]["items"];
  const dbPurchasesExpenses = formatCurrency(
    dbMetrics["purchases"]["expenses"]
  );
  const dbPurchasesOrders = dbMetrics["purchases"]["orders"];
  const dbPurchasesItems = dbMetrics["purchases"]["items"];
  const calcAllExpenses = formatCurrency(calcSalesCombinedExpenseFees + dbPurchasesExpenses);

  const data = [
    {id: 0, value: dbSalesEarnings, color: "green", label: 'Income'},
    {id: 1, value: calcAllExpenses, color: "red", label: "Expenses"},
  ];

  return (
    <>
      <Typography sx={{ padding: 4, textAlign: "center" }} variant="h5">
        Metrics for (variable set time)
      </Typography>

      <PieChart
        sx={{ padding: 4}}
        series={[
          {
            data,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          },
        ]}
        height={200}
      />

      <TableContainer sx={{ marginBottom: 4, marginInline: "auto", width: "60%" }}>
        <Typography sx={{ paddingLeft: 4 }} variant="h6">
          Sales
        </Typography>
        <Table
          sx={{ maxWidth: 600 }}
          size="small"
          aria-label="customized table"
        >
          <TableBody>
            <TableRow>
              <StyledTableCell variant="head">Field</StyledTableCell>
              <StyledTableCell variant="head" align="right">
                Total
              </StyledTableCell>
            </TableRow>
            <StyledTableRow>
              <StyledTableCell variant="head" component="th" scope="row">
                Total Earnings
              </StyledTableCell>
              <StyledTableCell align="right">
                $ {dbSalesEarnings}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell variant="head" component="th" scope="row">
                Total Raw Expenses
              </StyledTableCell>
              <StyledTableCell align="right">
                $ {dbSalesExpenses}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell variant="head" component="th" scope="row">
                Total Fees
              </StyledTableCell>
              <StyledTableCell align="right">$ {dbSalesFees}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell variant="head" component="th" scope="row">
                Expenses + Fees
              </StyledTableCell>
              <StyledTableCell align="right">
                $ {calcSalesCombinedExpenseFees}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell variant="head" component="th" scope="row">
                Orders Completed
              </StyledTableCell>
              <StyledTableCell align="right">{dbSalesOrders}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell variant="head" component="th" scope="row">
                Items Sold
              </StyledTableCell>
              <StyledTableCell align="right">{dbSalesItems}</StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer sx={{ marginBottom: 4, marginInline: "auto", width: "60%" }}>
        <Typography sx={{ paddingLeft: 4 }} variant="h6">
          Purchases
        </Typography>
        <Table sx={{ maxWidth: 600 }} size="small" aria-label="customized table">
          <TableBody>
            <TableRow>
              <StyledTableCell variant="head">Field</StyledTableCell>
              <StyledTableCell variant="head" align="right">
                Total
              </StyledTableCell>
            </TableRow>
            <StyledTableRow>
              <StyledTableCell variant="head" component="th" scope="row">
                Total Expenses
              </StyledTableCell>
              <StyledTableCell align="right">
                $ {dbPurchasesExpenses}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell variant="head" component="th" scope="row">
                Number of Expenses
              </StyledTableCell>
              <StyledTableCell align="right">
                {dbPurchasesOrders}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell variant="head" component="th" scope="row">
                Items Bought
              </StyledTableCell>
              <StyledTableCell align="right">
                {dbPurchasesItems}
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
