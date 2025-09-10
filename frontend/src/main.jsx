import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import CurrencyConverter from "./CurrencyConverter.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CurrencyConverter />
  </StrictMode>
);
