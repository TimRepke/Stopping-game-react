import { 
  Paper,
  TextField,
  Button,
  Grid
} from "@mui/material";
import type { RowT } from ".";
import { useSubmitResultMutation } from "../../redux/api/gameResult";
import React from "react";

type Props = {
  dataset : string | null,
  method: string | null,
  confidenceLevel: number | null,
  bias: number | null,
  recallTarget: number | null,
  currentBatch: number | null,
  currentRow: RowT
}

export const SubmitModal = (props:Props) => {
  const { currentRow, currentBatch } = props
  const [ submitResult ]  =  useSubmitResultMutation()
  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  
  const handleSubmit = () => {
    const name = nameRef.current?.value;
    // const email = nameRef.current?.value;
    if (!name) return
    const submitObj = {
      userName: name,
      stoppingStep: currentBatch || 0,
      score: currentRow.method_score
    }
    submitResult(submitObj)
  }

  return (
    <Paper>
      <Grid container spacing={2} padding={2}>
        <Grid>Current Batch Values </Grid>
        <Grid>Seen: <b>{currentRow.n_seen}</b></Grid>
        <Grid>Included: <b>{currentRow.n_incl_seen}</b></Grid>
        <Grid>Score: <b>{currentRow.method_score.toFixed(4)}</b></Grid>
        <Grid>
          <TextField inputRef={nameRef} id="Name" label="Name" variant="outlined" />
        </Grid>
        <Grid>
          <TextField inputRef={emailRef} id="Email" label="Email" variant="outlined" />
        </Grid>
        <Button variant="contained" color="success"
          onClick={handleSubmit}
        >
          Submit Result!
        </Button>
        <Button variant="contained" color="warning">Cancel</Button>
      </Grid>
    </Paper>
  )
};