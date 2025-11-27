import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import StoppingGame from "./components/stoppingGame";
import { ThemeControllerProvider } from "./components/theme/themeContext";

function App() {

  return (
    <BrowserRouter>
      <ThemeControllerProvider>
        <Provider store={store}>
            <Routes>
              <Route path="/" element={<StoppingGame/>}/>
              <Route path="/*" element={<>not found</>} />
            </Routes>
        </Provider>
      </ThemeControllerProvider>
    </BrowserRouter>
  )
}

export default App
