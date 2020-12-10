import React from "react";

import { ConfigProvider } from "antd";
import "./styles.css";
import Home from "./views/Home";
import { ThemeProvider } from "styled-components";
import * as myTheme from "./theme";

function App() {
  return (
    <ConfigProvider>
      <ThemeProvider theme={myTheme["sm"]}>
        <div className="App">
          <Home />
        </div>
      </ThemeProvider>
    </ConfigProvider>
  );
}

export default App;
