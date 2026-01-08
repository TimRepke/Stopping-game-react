import { Grid, Paper, CardContent, Typography, CardActions, Button } from "@mui/material"

type Props = {
  cardText: string,
  buttonText: string,
  action: () => void | Promise<void>
}
const HomeCard = (props: Props) => {

  return (
    <Grid size={4} >
      <Paper elevation={3} sx={{ minHeight: "300px" }}>
        <CardContent>
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            {props.cardText}
          </Typography>
        </CardContent>
        <CardActions>
          <Button 
            variant="contained" 
            color="success" 
            size="small"
            onClick={props.action}
          >
            {props.buttonText}
          </Button>
        </CardActions>
      </Paper>
    </Grid>
  )
}

export default HomeCard