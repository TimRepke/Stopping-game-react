import { Box, Typography, LinearProgress, Stack } from "@mui/material";

const ProgressBlock = ({
  label,
  current,
  total,
  value,
  barColor,
}: {
  label: string;
  current: number;
  total: number;
  value: number;
  barColor: string;
}) => (
  <Stack spacing={0.5}>
    <Box display="flex" justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {current} / {total} ({Math.round(value)}%)
      </Typography>
    </Box>

    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height: 10,
        borderRadius: 5,
        backgroundColor: "rgba(75, 75, 75, 0.47)",
        "& .MuiLinearProgress-bar": {
          borderRadius: 5,
          backgroundColor: barColor,
          transition: "background-color 0.3s ease",
        },
      }}
    />
  </Stack>
);

export default ProgressBlock;
