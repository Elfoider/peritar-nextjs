"use client";
import * as React from "react";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Header from "./components/Header";
import AppNavbar from "./components/AppNavbar";
import SideMenu from "./components/SideMenu";
import AppTheme from "../../shared-theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./theme/customizations";
import { SelectChangeEvent } from "@mui/material/Select";
import { useRouter } from "next/navigation";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard({
  children,
  ...props
}: {
  children?: React.ReactNode;
  disableCustomTheme?: boolean;
}) {
  const router = useRouter();
  const [modeChanged, setModeChanged] = React.useState("superuser");
  const handleChangeMode = (event: SelectChangeEvent) => {
    setModeChanged(event.target.value);
  };

  React.useEffect(() => {
    router.push(`/dashboard/${modeChanged}`);
  }, [modeChanged]);

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu changeMode={handleChangeMode} dashboardMode={modeChanged} />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            {children}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
