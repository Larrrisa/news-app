import { BrowserRouter, Routes, Route } from "react-router-dom";
import Page from "./Pages/News";
import MainPage from "./Pages/MainPage";
import NotFoundPage from "./Pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/:id" element={<Page />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
