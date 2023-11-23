import * as React from 'react';
import { Button, Dialog, DialogTitle } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PackingSlipPDF from './PackingSlipPDF.jsx';

export default function PrintPreview(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button disabled={props.disabled} className="MuiButton-root btn bold" onClick={handleClickOpen}>
        Print
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="print-preview"
        fullWidth={false}
        maxWidth={"md"}
      >
        <DialogTitle id="print-preview">
          Print Preview
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <PackingSlipPDF address={props.address} />
      </Dialog>
    </>
  );
}