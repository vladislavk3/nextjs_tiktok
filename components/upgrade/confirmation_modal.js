import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useState } from "react";

export default function ConfirmationModal({ open, handleClose }) {
  const [discount, setDiscount] = useState({});
  const [code, setCode] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const applyDiscount = () => {
    fetch('/api/checkout/valid_code?code=' + code).then(r=> r.json()).then(r => {
      if(r) {
        setDiscount({trial: r})
        setAppliedCode(code)
        setCode('')
      } else {
        setDiscount({error: true})
      }
    });
  }
  const checkOut = () => checkout(appliedCode)

  return <div>
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Checkout</DialogTitle>
      <DialogContent>
        <Grid container justify="space-between">
          <Grid item><Typography variant="body1">Total:</Typography></Grid>
          <Grid item><Typography variant="body1">$29.99/mo</Typography></Grid>
        </Grid>
        {discount?.trial && <Grid container justify="space-between">
          <Grid item><Typography variant="body2" color="textSecondary">Discount code applied: {discount.trial}-day free trial</Typography></Grid>
        </Grid>}
        {discount?.error && <Grid container justify="space-between">
          <Grid item><Typography variant="body2" color="error">Invalid code</Typography></Grid>
        </Grid>}
        <Grid container justify="space-between">
          <Grid item><TextField margin="dense" label="Referral code" type="text" fullWidth
          value={code} onChange={(e) => setCode(e.target.value)}/></Grid>
          <Grid item style={{ paddingTop: '20px' }}>
            <Button onClick={applyDiscount} color="primary">
              Apply
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={checkOut} color="primary">
          Check out
        </Button>
      </DialogActions>
    </Dialog>
  </div>
}

async function checkout(code) {
  var stripe = Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
  const stripe_info = await fetch('/api/checkout/start?code=' + code).then(r => r.json());
  return stripe.redirectToCheckout({ sessionId: stripe_info.id });
}