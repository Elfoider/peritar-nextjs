import * as React from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SelectContent from "./SelectContent";
import MenuContent from "./MenuContent";
import CardAlert from "./CardAlert";
import OptionsMenu from "./OptionsMenu";
import { SelectChangeEvent } from "@mui/material/Select";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

export default function SideMenu({
  changeMode,
  dashboardMode,
}: {
  changeMode?: (event: SelectChangeEvent) => void;
  dashboardMode?: string;
}) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
          p: 1.5,
        }}
      >
        <SelectContent
          handleChange={changeMode ?? (() => {})}
          valueChanged={dashboardMode}
        />
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MenuContent modeChanged={dashboardMode} />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Avatar
          sizes="small"
          alt={
            dashboardMode === "superuser"
              ? "Super Usuario"
              : dashboardMode === "aseguradora"
              ? "Aseguradora"
              : dashboardMode === "peritos"
              ? "Perito"
              : dashboardMode === "clientes"
              ? "Cliente"
              : "Modo Desconocido"
          }
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: "auto" }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: "16px" }}
          >
            {dashboardMode === "superuser"
              ? "Super Usuario"
              : dashboardMode === "aseguradora"
              ? "Aseguradora"
              : dashboardMode === "peritos"
              ? "Perito"
              : dashboardMode === "clientes"
              ? "Cliente"
              : "Modo Desconocido"}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {dashboardMode === "superuser" ? "Todo el poder" : ""}
            {dashboardMode === "aseguradora" ? "Panel de Aseguradora" : ""}
            {dashboardMode === "peritos" ? "Panel de Peritos" : ""}
            {dashboardMode === "clientes" ? "Panel de Clientes" : ""}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
