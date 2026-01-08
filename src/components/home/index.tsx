import { Box, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeCard from "./homeCard";

const Home = () => {
  const nav = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Welcome to the Stopping Game
        </Typography>
        <Typography variant="body1">
          The Stopping Game is a decision-making challenge where players must decide the
          optimal moment to stop in order to maximize their score. It's a fun way to
          explore strategies, probabilities, and test your instincts!
        </Typography>
      </Box>

      {/* How It Works Section */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          How the Game Works
        </Typography>
        <Typography variant="body2">
          Each round, you'll see a sequence of events or items. Your goal is to choose
          the right moment to stop before missing out on potential points or going too far.
          You can play solo to practice your timing or compete with others in multiplayer sessions.
        </Typography>
      </Box>

      {/* Action Cards */}
      <Grid container spacing={2} padding={1}>
        <HomeCard
          cardText="Practice the game solo to get a feel for the mechanics and improve your strategy."
          buttonText="Play!"
          action={() => nav("/gameSetup")}
        />
        <HomeCard
          cardText="Start a multiplayer session to challenge friends or other players online."
          buttonText="Create a session!"
          action={() => nav("/gameSetup?type=1")}
        />
        <HomeCard
          cardText="Join an existing multiplayer game session and compete with others for the best score."
          buttonText="Join a session"
          action={() => nav("/game")}
        />
      </Grid>
    </Box>
  );
}

export default Home;
