import React from "react";

import { ConfigProvider } from "antd";
import "./styles.css";
import Home from "./views/Home";

function App() {
  return (
    <ConfigProvider>
      <div className="App">
        <Home />
      </div>
    </ConfigProvider>
  );
}

export default App;
