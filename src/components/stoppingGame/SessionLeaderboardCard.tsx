import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

type SessionPlayer = {
  name: string;
  score: number;
};

const mockSessionData: SessionPlayer[] = [
  { name: 'Guest user 3', score: 45 },
  { name: 'Alice', score: 38 },
  { name: 'Guest user 12', score: 52 },
  { name: 'Bob', score: 31 },
];

// Sort highest → lowest score
const sortedPlayers = [...mockSessionData].sort(
  (a, b) => b.score - a.score
);

const SessionLeaderboardCard = () => {
  return (
    <Card >
      <CardHeader
        title="Session Leaderboard"
        titleTypographyProps={{ variant: 'subtitle1' }}
      />

      <CardContent sx={{ pt: 0 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Player</TableCell>
              <TableCell align="right">Score</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedPlayers.map((player, index) => (
              <TableRow key={`${player.name}-${index}`}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {player.name}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {player.score}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SessionLeaderboardCard;
