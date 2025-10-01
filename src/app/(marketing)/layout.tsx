"use client";
import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import AppTheme from "../shared-theme/AppTheme";
import AppAppBar from "./components/AppAppBar";
import Footer from "./components/Footer";
import { StyledEngineProvider } from "@mui/material/styles";
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StyledEngineProvider injectFirst>
      <AppTheme>
        <CssBaseline enableColorScheme />
        <AppAppBar />
        <div>{children}</div>
        <Divider />
        <Footer />
      </AppTheme>
    </StyledEngineProvider>
  );
}
