import { useEffect, useState } from "react";
import { Button } from "semantic-ui-react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Page from "./Pages/News";
import MainPage from "./Pages/MainPage";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/:id" element={<Page />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
