import React, { FC } from "react";
import Main from "./routes/main";
import {BrowserRouter, Routes,Route} from 'react-router-dom';
const App: FC = () => {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Main/>} />
    </Routes>
  </BrowserRouter>;
};

export default App;
