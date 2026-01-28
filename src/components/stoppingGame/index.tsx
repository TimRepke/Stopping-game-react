import * as React from "react";
import {
  Button,
  ButtonGroup,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import SessionLeaderboardCard from "./SessionLeaderboardCard";
import { useGetDatasetsQuery, type DatasetT } from "../../redux/api/gameApi";
import { useSearchParams } from "react-router-dom";
import { useSubmitResultMutation, type resultT } from "../../redux/api/gameResult";
import Chart from "./Chart";
import { CalcScore, getOrCreateUserId, lerpColor } from "../../lib/helper";
import SetInfoCard from "./SetInfoCard";
import ProgressBlock from "./ProgressBlock";
import SpeedIcon from "@mui/icons-material/Speed";
import ResultsModal from "./ResultsModal";


const StoppingGame: React.FC = () => {
  const [searchParams] = useSearchParams();

  const theme = useTheme()

  const setIds = searchParams.get("sets")?.split(',').map(itm => parseInt(itm)) ?? [];
  // const sessionId = searchParams.get("session") ? Number(searchParams.get("session")) : 50;
  // const sessionPlayersData = React.useState({})
  const [results, setResults] = React.useState<resultT[]>([])

  const [autoPlay, setAutoPlay] = React.useState<boolean>(false);
  const storageUserID = getOrCreateUserId();

  const { data: dataSets, isLoading: dataIsLoading } = useGetDatasetsQuery(setIds)

  // Current status of the dataset
  // 0 == unseen, 1 == running, 2 == stopped
  const [datasetModes, setDatasetModes] = React.useState<number[]>(setIds.map(() => 0));

  const [currentSet, setCurrentSet] = React.useState<DatasetT | null>(null)
  const [resultViewOpen, setResultViewOpen] = React.useState<boolean>(false)
  const [currentSetStarted, setCurrentSetStarted] = React.useState<boolean>(false)

  const [currentRowIndex, setCurrentRowIndex] = React.useState<number>(0);
  const [currentSetIndex, setCurrentSetIndex] = React.useState<number>(0);
  const [lastRowIndex, setLastRowIndex] = React.useState<number>(0);

  const type = Number(searchParams.get("type"));
  const defaultGameSpeed = searchParams.get("speed") ? Number(searchParams.get("speed")) : 50;
  const [gameSpeed, setGameSpeed] = React.useState<number>(defaultGameSpeed);
  const [speedSetting, SetSpeedSetting] = React.useState<number>(0);

  const [SubmitMethod] = useSubmitResultMutation()

  React.useEffect(() => {
    switch (speedSetting) {
      case 0:
        setGameSpeed(defaultGameSpeed)
        break
      case 1:
        setGameSpeed(defaultGameSpeed / 2)
        break
      case 2:
        setGameSpeed(defaultGameSpeed / 5)
        break
      case 3:
        setGameSpeed(defaultGameSpeed * 2)
        break
      case 4:
        setGameSpeed(defaultGameSpeed * 5)
        break
      default:
        setGameSpeed(defaultGameSpeed)
        break
    }
  }, [defaultGameSpeed, speedSetting])


  // if (currentSet !== null && !currentSet.rows) {
  //   return (<></>)
  // }

  React.useEffect(() => {
    if (dataSets && !dataIsLoading) {
      setCurrentSet(dataSets[0])
      setCurrentRowIndex(0)
      // setCurrentSetIndex(0)
      setLastRowIndex(currentSet?.rows?.length ?? 0)
    }
  }, [currentSet?.rows?.length, dataIsLoading, dataSets]);

  React.useEffect(() => {
    if (dataSets && !dataIsLoading) {
      if (currentSetIndex < dataSets.length) {
        setCurrentSet(dataSets[currentSetIndex]);
      } else {
        setCurrentSet(dataSets[dataSets.length - 1]);
        setCurrentSetIndex(dataSets.length - 1);
      }
    } else {
      setCurrentSetIndex(0);
      setCurrentSet(null);
    }
  }, [currentSetIndex, dataIsLoading, dataSets]);

  const stopAuto = () => {
    setAutoPlay(false)
    datasetModes[currentSetIndex] = 2;
    setDatasetModes(datasetModes);
    saveCurrentResults()
    setResultViewOpen(true)
  };

  const HandleNext = () => {
    setResultViewOpen(false);
    setCurrentRowIndex(0);

    if (dataSets && dataSets.length > currentSetIndex) {
      setCurrentSetIndex((v) => v + 1);
    }

    setCurrentSetStarted(false)
  }

  const HandleSubmit = () => {
    SubmitMethod(results[currentSetIndex])
  }

  const saveCurrentResults = () => {
    if (!currentSet || !currentSet.rows) return;
    const set = dataSets?.[currentSetIndex];
    if (!set) return;
    const result: resultT = {
      uuid: storageUserID,
      datasetId: set.id,
      stoppingStep: currentRowIndex,
      score: CalcScore(currentSet.rows[currentRowIndex]),
    }
    setResults(res => [...res, result])
  }

  const startAuto = () => {
    if (!currentSet || !currentSet.rows) return
    if (currentSet.rows.length > 0) {
      setCurrentSetStarted(true)
      setAutoPlay(true);
      datasetModes[currentSetIndex] = 1;
      setDatasetModes(datasetModes);
    }
  };

  const HandleReset = () => {
    setCurrentSetStarted(false)
    setAutoPlay(false)
    setCurrentRowIndex(0)
  }

  return (
    <Grid container spacing={2} padding={2} sx={{ justifyContent: "space-between" }}>
      <Grid size={9}>
        <Stack>
          <Grid spacing={2} padding={2}>
            {currentSet === null || !currentSet.rows ? (<CircularProgress />) : (
              <Stack spacing={1}>
                <ProgressBlock
                  label="Seen"
                  current={currentSet.rows[currentRowIndex].n_seen}
                  total={currentSet.rows[currentRowIndex].n_total}
                  value={currentSet.rows[currentRowIndex].n_seen / currentSet.rows[currentRowIndex].n_total * 100}
                  barColor={lerpColor(
                    theme.palette.success.main,
                    theme.palette.error.main,
                    currentSet.rows[currentRowIndex].n_seen / currentSet.rows[currentRowIndex].n_total
                  )}
                />
                {datasetModes[currentSetIndex] > 1 &&
                  <ProgressBlock
                    label="Included"
                    current={currentSet.rows[currentRowIndex].n_incl_seen}
                    total={currentSet.rows[currentRowIndex].n_incl}
                    value={currentSet.rows[currentRowIndex].n_incl_seen / currentSet.rows[currentRowIndex].n_incl * 100}
                    barColor={lerpColor(
                      theme.palette.error.main,
                      theme.palette.success.main,
                      currentSet.rows[currentRowIndex].n_incl_seen / currentSet.rows[currentRowIndex].n_incl
                    )}
                  />}

                {dataSets && dataSets.map((set, index) => (
                  index === currentSetIndex ? <Chart
                    key={set.id}
                    data={set.rows ?? []}
                    currentRowIndex={currentRowIndex}
                    lastRowIndex={lastRowIndex}
                    setCurrentRowIndex={setCurrentRowIndex}
                    gameSpeed={gameSpeed}
                    autoPlay={autoPlay}
                    stopMethod={() => stopAuto()}
                  /> : <></>
                ))}
                <Grid container justifyContent="center" padding={2}>
                  <Stack spacing={1} alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SpeedIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Game Speed
                      </Typography>
                    </Stack>

                    <ButtonGroup
                      variant="contained"
                      size="small"
                      sx={{
                        borderRadius: 999,
                        overflow: "hidden",
                        "& .MuiButton-root": {
                          px: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          transition: "all 0.2s ease",
                        },
                      }}
                    >
                      <Button
                        disabled={speedSetting === 4}
                        onClick={() => SetSpeedSetting(4)}
                      >
                        0.2×
                      </Button>

                      <Button
                        disabled={speedSetting === 3}
                        onClick={() => SetSpeedSetting(3)}
                      >
                        0.5×
                      </Button>

                      <Button
                        disabled={speedSetting === 0}
                        onClick={() => SetSpeedSetting(0)}
                      >
                        Default ({defaultGameSpeed})
                      </Button>

                      <Button
                        disabled={speedSetting === 1}
                        onClick={() => SetSpeedSetting(1)}
                      >
                        2×
                      </Button>

                      <Button
                        disabled={speedSetting === 2}
                        onClick={() => SetSpeedSetting(2)}
                      >
                        5×
                      </Button>
                    </ButtonGroup>
                  </Stack>
                </Grid>
                <Grid container spacing={2} size={12} sx={{ justifyContent: "center" }}>
                  {/* <Button variant="contained" onClick={prevBatch}>
                      Previous
                  </Button>
                  <Button variant="contained" onClick={nextBatch}>
                    Next
                  </Button> */}
                  <Button
                    variant="contained"
                    disabled={!currentSetStarted}
                    onClick={() => stopAuto()}
                    color="error">
                    Stop
                  </Button>
                  <Button
                    variant="contained"
                    disabled={currentSetStarted}
                    onClick={() => startAuto()}
                    color="success">
                    Start
                  </Button>
                  <Button variant="contained" onClick={() => HandleReset()} color="warning">
                    Reset
                  </Button>
                </Grid>
              </Stack>
            )}
          </Grid>
        </Stack>
      </Grid>
      <Grid size={3}>
        <Stack spacing={1}>
          {type === 1 ? <SessionLeaderboardCard /> : <></>}
          {dataSets?.map((set, index) => (
            <SetInfoCard
              set={set}
              result={results.find((res) => res.datasetId === set.id) ?? undefined}
              state={datasetModes[index]}
              isActive={index === currentSetIndex}
              key={set.id}
            />
          ))}
        </Stack>
      </Grid>
      {currentSet
        && currentSet.rows
        && results.length
        && results[currentSetIndex]
        && <ResultsModal
          open={resultViewOpen}
          onClose={() => setResultViewOpen(false)}
          HandleNext={() => HandleNext()}
          HandleSubmit={() => HandleSubmit()}
          results={results[currentSetIndex]}
          data={currentSet.rows[currentRowIndex]}
          isLastSet={dataSets?.length === (currentSetIndex + 1)}
        />}
    </Grid>
  );
};

export default StoppingGame;
