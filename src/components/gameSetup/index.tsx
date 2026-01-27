import { 
  Autocomplete,
  Box,
  Button,
  Drawer,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import React from "react";
import { useGetDatasetRegistryQuery, type DatasetT } from "../../redux/api/gameApi";
import RegistryTable from "../registryTable";
import { useNavigate, useSearchParams } from "react-router-dom";


const GameSetup = () => {
  const [searchParams] = useSearchParams();
  const type = Number(searchParams.get("type"));
  const nav = useNavigate()
  const [dataSets, setDataSets] = React.useState<DatasetT[]>([])
  const [gameSpeed, setGameSpeed] = React.useState<number>(300)
  const [isSearching, setIsSearching] = React.useState<boolean>()

  const [uniqueDatasets, setUniqueDatasets] = React.useState<string[]>()
  const [uniqueMethods, setUniqueMethods] = React.useState<string[]>()
  const [uniqueConfidences, setUniqueConfidences] = React.useState<Array<number | "nan" | "none">>()
  const [uniqueRecall, setUniqueRecall] = React.useState<Array<number | "nan" | "none">>()
  const [uniqueBias, setUniqueBias] = React.useState<Array<number | "nan" | "none">>()

  const [datasetFilter, SetDatasetFilter] = React.useState<string | null>(null)
  const [methodFilter, SetMethodFilter] = React.useState<string | null>(null)
  const [confidenceFilter, SetConfidenceFilter] = React.useState<number | "nan" | "none" | null>(null)
  const [recallFilter, SetRecallFilter] = React.useState<number | "nan" | "none" | null>(null)
  const [biasFilter, SetBiasFilter] = React.useState<number | "nan" | "none" | null>(null)

  const [filteredDataSets, setFilteredDataSets] = React.useState<DatasetT[]>([])



  const { data: DatasetRegistry, isLoading: DSRegistryIsLoading} = useGetDatasetRegistryQuery()

  React.useEffect(()=>{
    if (DSRegistryIsLoading || !DatasetRegistry) return
    const DSArr: string[] = []
    const MethodArr: string[] = []
    const ConfArr: Array<number | "nan" | "none"> = []
    const RecallArr: Array<number | "nan" | "none"> = []
    const BiasArr: Array<number | "nan" | "none"> = []

    const filteredDataSetArray = DatasetRegistry.filter((entry) => {
      if (datasetFilter && entry.dataset !== datasetFilter) return false
      if (methodFilter && entry.method !== methodFilter) return false
      if (confidenceFilter && entry.method_confidence_level !== confidenceFilter) return false
      if (recallFilter && entry.method_recall_target !== recallFilter) return false
      if (biasFilter && entry.method_bias !== biasFilter) return false
      return true
    });

    setFilteredDataSets(filteredDataSetArray);

    filteredDataSetArray.forEach(DS => {
      if (!DSArr.includes(DS.dataset)) DSArr.push(DS.dataset)
      if (!MethodArr.includes(DS.method)) MethodArr.push(DS.method)
      if (!ConfArr.includes(DS.method_confidence_level)) ConfArr.push(DS.method_confidence_level)
      if (!RecallArr.includes(DS.method_recall_target)) RecallArr.push(DS.method_recall_target)
      if (!BiasArr.includes(DS.method_bias)) BiasArr.push(DS.method_bias)
    });

    setUniqueDatasets(DSArr)
    setUniqueMethods(MethodArr)
    setUniqueConfidences(ConfArr)
    setUniqueRecall(RecallArr)
    setUniqueBias(BiasArr)
  }, [DSRegistryIsLoading, DatasetRegistry, biasFilter, confidenceFilter, datasetFilter, methodFilter, recallFilter])

  const HandleDatasetNumChange = (value: string) => {
    const newSetsLength = parseInt(value) || 1

    if (dataSets.length === newSetsLength) {
      return
    } else if (dataSets.length < newSetsLength) {
      const dif = newSetsLength - dataSets.length;
      for (let i = 0; i < dif; i++) {
        AddNewRandomSet()
      }
    } else if (dataSets.length > newSetsLength) {
      let newDatasetArray: DatasetT[] = [];
      for (let i = 0; i < newSetsLength; i++) {
        newDatasetArray = [...newDatasetArray, dataSets[i]]
      }
      setDataSets(newDatasetArray)
    }

  }

  const HandleDatasetFilterChange = (val: string | null) => {
    SetDatasetFilter(val)
  }

  const HandleMethodFilterChange = (val: string | null) => {
    SetMethodFilter(val)
  }
  const HandleConfidenceFilterChange = (val: number | "nan" | "none" | null) => {
    SetConfidenceFilter(val)
  }
  const HandleRecallFilterChange = (val: number | "nan" | "none" | null) => {
    SetRecallFilter(val)
  }
  const HandleBiasFilterChange = (val: number | "nan" | "none" | null) => {
    SetBiasFilter(val)
  }

  const HandleAddDataSet = (ds: DatasetT) => {
    setDataSets([...dataSets, ds])
  }

  const AddNewRandomSet = () => {
    if (!DatasetRegistry || !DatasetRegistry.length) return;
    const RandomSet = DatasetRegistry[Math.floor(Math.random() * DatasetRegistry.length)]
    setDataSets([...dataSets, RandomSet])
  }

  const HandleRemoveSet = (num:number) => {
    const newSet = dataSets.filter((set, index) => index != num)
    setDataSets(newSet)
  }

  const HandleGameSpeedChange = (value: string) => {
    const speed = parseInt(value) || 300
    setGameSpeed(speed)
  }

  const HandleStartGame = () => {
    nav(`/game?speed=` + gameSpeed + `&type=` + (type ?? 1) + `&sets=` + dataSets.map(ds => ds.id))
  }

  return (
    <Stack>
      <Grid container padding={2} spacing={2}>
        <Grid>
          <Typography>
            Configure the game settings:
          </Typography>
        </Grid>
        <Stack spacing={2}>
          <TextField
            label="Game Speed"
            variant="outlined"
            value={gameSpeed}
            type="number"
            onChange={e => HandleGameSpeedChange(e.target.value)}
          />
          <TextField 
            label="Number of Data sets" 
            variant="outlined" 
            value={dataSets.length} 
            type="number" 
            onChange={e => HandleDatasetNumChange(e.target.value)}
          />
        </Stack>
        <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Data Set</TableCell>
                <TableCell align="left">Method</TableCell>
                <TableCell align="right">Bias</TableCell>
                <TableCell align="right">Confidence Level</TableCell>
                <TableCell align="right">Recall Target</TableCell>
                <TableCell align="right">Size</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataSets.map((set, index) => (
                <TableRow
                  key={set.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="left">{set.dataset ?? "-"}</TableCell>
                  <TableCell align="left">{set.method ?? "-"}</TableCell>
                  <TableCell align="right">{set.method_bias ?? "-"}</TableCell>
                  <TableCell align="right">{set.method_confidence_level ?? "-"}</TableCell>
                  <TableCell align="right">{set.method_recall_target ?? "-"}</TableCell>
                  <TableCell align="right">{set.row_count ?? "-"}</TableCell>
                  <TableCell align="right">
                    <Button variant="outlined" color="error" onClick={() => HandleRemoveSet(index)}>X</Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell colSpan={3}>
                  <Grid container spacing={1} sx={{justifyContent:"flex-end"}}>
                    <Button variant="outlined" color="warning" onClick={() => setIsSearching(true)}>Search</Button>
                    <Button variant="outlined" color="success" onClick={() => AddNewRandomSet()}>Add a Random Set</Button>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        </Box>
      </Grid>
      <Button
        disabled={!dataSets.length}
        variant="contained"
        color="success"
        size="large"
        sx={{ width: "50%", alignSelf: "center"}}
        onClick={() => HandleStartGame()}
      >
        Start!
      </Button>
      <Drawer anchor={"right"}  open={isSearching} onClose={() => setIsSearching(false)}>
        <Stack spacing={2} padding={2}>
          <Grid container spacing={1}>
            <Autocomplete
              disablePortal
              options={uniqueDatasets ?? []}
              sx={{ width: 300 }}
              onChange={(e , v) => HandleDatasetFilterChange(v)}
              renderInput={(params) => <TextField {...params} label="Data Set" />}
            />
            <Autocomplete
              disablePortal
              options={uniqueMethods ?? []}
              sx={{ width: 300 }}
              onChange={(e, v) => HandleMethodFilterChange(v)}
              renderInput={(params) => <TextField {...params} label="Method" />}
            />
            <Autocomplete
              disablePortal
              options={uniqueConfidences ?? []}
              sx={{ width: 300 }}
              onChange={(e, v) => HandleConfidenceFilterChange(v)}
              renderInput={(params) => <TextField {...params} label="Confidence Level" />}
            />
            <Autocomplete
              disablePortal
              options={uniqueBias ?? []}
              sx={{ width: 300 }}
              onChange={(e, v) => HandleBiasFilterChange(v)}
              renderInput={(params) => <TextField {...params} label="Bias" />}
            />
            <Autocomplete
              disablePortal
              options={uniqueRecall ?? []}
              sx={{ width: 300 }}
              onChange={(e, v) => HandleRecallFilterChange(v)}
              renderInput={(params) => <TextField {...params} label="Recall Target" />}
            />
          </Grid>
          {filteredDataSets && <RegistryTable rows={filteredDataSets} HandleAddDataSet={HandleAddDataSet}/>}          
        </Stack>
      </Drawer>
    </Stack>
  )
};

export default GameSetup;