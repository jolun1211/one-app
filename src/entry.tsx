import React, { useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import routers from './routes';
const Container = () => {
  return (
    <BrowserRouter>
      <ul>
        {
          routers.map((item) => {
            return <li><Link to={item.path}>{item.title}</Link></li>
          })
        }
      </ul>

      <Routes>
        {
          routers.map((item) => {
            return <Route path={item.path} element={<item.component />}></Route>
          })
        }

      </Routes>
    </BrowserRouter>
  );
}
export default Container;
