import {
  Paper,
  Typography,
  Stack,
  Grid,
  Divider,
  Box,
  Chip,
  Collapse,
} from "@mui/material";
import type { DatasetT } from "../../redux/api/gameApi";
import type { resultT } from "../../redux/api/gameResult";

type Props = {
  isActive: boolean;
  set: DatasetT;
  result: resultT | undefined;
};

// 🔧 Mocked leaderboard data for this dataset
const mockTopScores = [
  { name: "Guest user 12", score: 92 },
  { name: "Alice", score: 87 },
  { name: "Guest user 3", score: 81 },
];

const SetInfoCard = ({
  isActive,
  set,
  result,
}: Props) => {
  const personalBest = result?.score ?? null;

  return (
    <Paper
      elevation={isActive ? 10 : 1}
      sx={{
        p: isActive ? 2 : 1.5,
        borderRadius: 2,
        border: isActive ? "2px solid" : "1px solid",
        borderColor: isActive ? "primary.main" : "divider",
        opacity: isActive ? 1 : 0.7,
        transition: "all 0.25s ease",
      }}
    >
      <Stack spacing={isActive ? 2 : 1}>
        {/* Dataset Header (always visible) */}
        <Box>
          <Typography
            variant={isActive ? "subtitle2" : "caption"}
            color="text.secondary"
          >
            Dataset
          </Typography>
          <Typography
            variant={isActive ? "h6" : "subtitle2"}
            fontWeight={isActive ? 600 : 400}
          >
            {set.dataset}
          </Typography>
        </Box>

        {/* Compact Stats (always visible) */}
        <Grid container spacing={1}>
          <Grid size={4}>
            <Typography variant="caption" color="text.secondary">
              Size
            </Typography>
            <Typography variant="body2">
              {set.rows ? set.rows[0].n_total : 0}
            </Typography>
          </Grid>

          <Grid size={4}>
            <Typography variant="caption" color="text.secondary">
              Included
            </Typography>
            <Typography variant="body2">
              {set.rows ? set.rows[0].n_incl : 0}
            </Typography>
          </Grid>

          <Grid size={4}>
            <Typography variant="caption" color="text.secondary">
              Top Score
            </Typography>
            <Typography variant="body2">
              {set.row_count}
            </Typography>
          </Grid>
        </Grid>

        {/* Expanded Section */}
        <Collapse in={isActive}>
          <Stack spacing={2} mt={1}>
            <Divider />

            {/* Performance */}
            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">
                  Personal Best
                </Typography>
                <Typography
                  variant="body1"
                  color={personalBest ? "success.main" : "text.disabled"}
                >
                  {personalBest ?? "—"}
                </Typography>
              </Grid>
            </Grid>

            {/* Top Scores */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Top Scores (Dataset)
              </Typography>

              <Stack spacing={1}>
                {mockTopScores.map((entry, index) => (
                  <Box
                    key={entry.name}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        size="small"
                        label={`#${index + 1}`}
                        color={index === 0 ? "warning" : "default"}
                      />
                      <Typography variant="body2">
                        {entry.name}
                      </Typography>
                    </Stack>

                    <Typography variant="body2" fontWeight={500}>
                      {entry.score}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Collapse>
      </Stack>
    </Paper>
  );
};

export default SetInfoCard;
