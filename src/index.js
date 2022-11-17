import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/antd.min.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MasterLayout from "./layout/MasterLayout";
import NotFound from "./pages/NotFound";
import { RealmProvider } from "./context/realmProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RealmProvider id='wowed-ijfty'>
    <BrowserRouter>
      <Routes>
        <Route element={<MasterLayout />}>
          <Route path='/' element={<App />}></Route>
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </RealmProvider>
);
