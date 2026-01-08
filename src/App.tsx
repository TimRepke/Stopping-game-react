import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import StoppingGame from "./components/stoppingGame";
import { ThemeControllerProvider } from "./components/theme/themeContext";
import Home from "./components/home";
import GameSetup from "./components/gameSetup";
import Header from "./components/header";
import { Box } from "@mui/material";

function App() {

  return (
    <BrowserRouter>
      <ThemeControllerProvider>
        <Provider store={store}>
            <Header />
            <Box padding={2}>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/gameSetup" element={<GameSetup/>}/>
              <Route path="/game" element={<StoppingGame/>}/>
              <Route path="/*" element={<>not found</>} />
            </Routes>
          </Box>
        </Provider>
      </ThemeControllerProvider>
    </BrowserRouter>
  )
}

export default App
