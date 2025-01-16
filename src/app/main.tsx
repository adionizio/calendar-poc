import * as React from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import Home from "./page";
import { enableMocking } from "../mocks";

require("dotenv").config();

const root = document.getElementById("root");
if (!root) throw new Error("No root element found");

enableMocking().then(() => {
  createRoot(root).render(
    <React.StrictMode>
      <Home />
    </React.StrictMode>
  );
});
