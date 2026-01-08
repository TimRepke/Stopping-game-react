import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

type LeaderboardRow = {
  playerName: string;
  dataset: string;
  score: number;
};

const mockData: LeaderboardRow[] = [
  { playerName: 'Guest user 12', dataset: 'Dataset A', score: 92 },
  { playerName: 'Guest user 3', dataset: 'Dataset B', score: 85 },
  { playerName: 'Alice', dataset: 'Dataset A', score: 78 },
  { playerName: 'Bob', dataset: 'Dataset C', score: 71 },
  { playerName: 'Guest user 7', dataset: 'Dataset B', score: 65 },
];

// Sort highest → lowest score
const sortedData = [...mockData].sort((a, b) => b.score - a.score);

const GlobalLeaderBoard = () => {
  return (
    <TableContainer component={Paper} elevation={1} sx={{paddingRight:"20px"}}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Leaderboard
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Player</TableCell>
            <TableCell>Dataset</TableCell>
            <TableCell align="right">Score</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedData.map((row, index) => (
            <TableRow key={`${row.playerName}-${index}`}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.playerName}</TableCell>
              <TableCell>{row.dataset}</TableCell>
              <TableCell align="right">{row.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GlobalLeaderBoard;
