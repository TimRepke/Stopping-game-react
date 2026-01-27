import {
  Paper,
  Typography,
  Stack,
  Grid,
  Divider,
  Box,
  Collapse,
} from "@mui/material";
import type { DatasetT } from "../../redux/api/gameApi";
import { useGetLeaderboardQuery, type resultT } from "../../redux/api/gameResult";
import SetTopScores from "./SetTopScores";
import { getOrCreateUserId } from "../../lib/helper";

type Props = {
  isActive: boolean;
  set: DatasetT;
  result: resultT | undefined;
  state: number;
};

const SetInfoCard = (
  {
    isActive,
    set,
    state,
    result,
  }: Props) => {

  const { data } = useGetLeaderboardQuery()
  if (!data) return;

  const userUID = getOrCreateUserId()
  const sortedData = data
    .filter((val) => val.datasetId === set.id)
    .filter((v, i) => i < 3)
    .map((val) => ({
      playerName: val.username,
      dataset: val.datasetName,
      score: val.score
    }))
    .sort(
      (a, b) => b.score - a.score
    );

  const userScores = data?.filter((v) => v.userUID === userUID && v.datasetId === set.id)
  const topScore = Math.max(...sortedData.map(v => v.score), 0)
  const personalBest = Math.max(result?.score ?? 0, Math.max(...userScores.map(v => v.score), 0))

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

          {state > 1 &&
            <Grid size={4}>
              <Typography variant="caption" color="text.secondary">
                Included
              </Typography>
              <Typography variant="body2">
                {set.rows ? set.rows[0].n_incl : 0}
              </Typography>
            </Grid>}

          <Grid size={4}>
            <Typography variant="caption" color="text.secondary">
              Top Score
            </Typography>
            <Typography variant="body2">
              {topScore}
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
                {!sortedData ? <>No scores for this Data set yet</> : sortedData.map((entry, index) => (
                  <SetTopScores userName={entry.playerName} score={entry.score} index={index} key={index} />
                ))}
              </Stack>
            </Box>
          </Stack>
        </Collapse>
      </Stack>
    </Paper>
  )
    ;
};

export default SetInfoCard;
