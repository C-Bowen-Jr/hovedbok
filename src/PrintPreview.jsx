import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogTitle } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PackingSlipPDF from './PackingSlipPDF.jsx';
import { setReship} from './Store';

export default function PrintPreview(props) {
  const [open, setOpen] = React.useState(false);
  const isReship = useSelector((state) => state.isReship);
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    isReship ? dispatch(setReship(false)) : undefined;
    setOpen(false);
  };

  return (
    <>
      <button disabled={props.disabled} className="MuiButton-root btn bold" onClick={handleClickOpen}>
        {isReship ? "Reship" : "Print"}
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