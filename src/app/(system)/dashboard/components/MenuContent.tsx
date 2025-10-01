import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import { useRouter } from "next/navigation";

// const mainListItems = [
//   { text: "Vista General", icon: <HomeRoundedIcon /> },
//   { text: "Analytics", icon: <AnalyticsRoundedIcon /> },
//   { text: "Clients", icon: <PeopleRoundedIcon /> },
//   { text: "Tasks", icon: <AssignmentRoundedIcon /> },
// ];

// const secondaryListItems = [
//   { text: "Settings", icon: <SettingsRoundedIcon /> },
//   { text: "About", icon: <InfoRoundedIcon /> },
//   { text: "Feedback", icon: <HelpRoundedIcon /> },
// ];

export default function MenuContent({ modeChanged }: { modeChanged?: string }) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = React.useState(0);

  const mainSuperUserLinks = [
    {
      text: "Vista General",
      icon: <HomeRoundedIcon />,
      route: `/dashboard/${modeChanged}`,
    },
    {
      text: "Gestion de Usuarios",
      icon: <AnalyticsRoundedIcon />,
      route: `/dashboard/${modeChanged}/gestion-de-usuarios`,
    },
    {
      text: "Monitoreo de Casos",
      icon: <PeopleRoundedIcon />,
      route: `/dashboard/${modeChanged}/monitoreo-de-casos`,
    },
    {
      text: "Reportes y Analiticas",
      icon: <AssignmentRoundedIcon />,
      route: `/dashboard/${modeChanged}/reportes-y-analiticas`,
    },
  ];

  const secondarySuperUserListItems = [
    {
      text: "Configuracion del Sistema",
      icon: <SettingsRoundedIcon />,
      route: `/dashboard/${modeChanged}/settings`,
    },
    {
      text: "Seguimiento de Usuarios",
      icon: <InfoRoundedIcon />,
      route: `/dashboard/${modeChanged}/user-tracking`,
    },
  ];
  const mainAseguradoraLinks = [
    {
      text: "Vista General",
      icon: <HomeRoundedIcon />,
      route: `/dashboard/${modeChanged}`,
    },
    {
      text: "Gestion de Siniestros/Casos",
      icon: <AnalyticsRoundedIcon />,
      route: `/dashboard/${modeChanged}/gestion-de-siniestros`,
    },
    {
      text: "Asignacion de Peritos",
      icon: <PeopleRoundedIcon />,
      route: `/dashboard/${modeChanged}/gestion-de-peritos`,
    },
    {
      text: "Gestion de Talleres",
      icon: <AssignmentRoundedIcon />,
      route: `/dashboard/${modeChanged}/gestion-de-talleres`,
    },
    {
      text: "Facturacion y Reportes",
      icon: <AssignmentRoundedIcon />,
      route: `/dashboard/${modeChanged}/facturacion-y-reportes`,
    },
  ];

  const secondaryAseguradoraListItems = [
    {
      text: "Configuracion del Sistema",
      icon: <SettingsRoundedIcon />,
      route: `/dashboard/${modeChanged}/settings`,
    },
    {
      text: "Seguimiento de Empleados",
      icon: <InfoRoundedIcon />,
      route: `/dashboard/${modeChanged}/employee-tracking`,
    },
  ];

  const mainPeritoLinks = [
    {
      text: "Vista General",
      icon: <HomeRoundedIcon />,
      route: `/dashboard/${modeChanged}`,
    },
    {
      text: "Mis Casos Asignados",
      icon: <AnalyticsRoundedIcon />,
      route: `/dashboard/${modeChanged}/mis-casos-asignados`,
    },
    {
      text: "Historial de Peritajes",
      icon: <PeopleRoundedIcon />,
      route: `/dashboard/${modeChanged}/historial-de-peritajes`,
    },
    {
      text: "Mi Perfil/Disponibilidad",
      icon: <AssignmentRoundedIcon />,
      route: `/dashboard/${modeChanged}/mi-perfil`,
    },
  ];

  const secondaryPeritoListItems = [
    {
      text: "Configuracion del Sistema",
      icon: <SettingsRoundedIcon />,
      route: `/dashboard/${modeChanged}/settings`,
    },
  ];

  const mainTallerLinks = [
    { text: "Vista General", icon: <HomeRoundedIcon />, route: "/dashboard" },
    {
      text: "Gestion de Presupuesto",
      icon: <AnalyticsRoundedIcon />,
      route: `/dashboard/${modeChanged}/gestion-de-presupuesto`,
    },
    {
      text: "Historial de Reparaciones",
      icon: <PeopleRoundedIcon />,
      route: `/dashboard/${modeChanged}/historial-de-reparaciones`,
    },
    {
      text: "Perfil del Taller",
      icon: <AssignmentRoundedIcon />,
      route: `/dashboard/${modeChanged}/perfil-del-taller`,
    },
  ];

  const secondaryTallerListItems = [
    {
      text: "Configuracion del Sistema",
      icon: <SettingsRoundedIcon />,
      route: `/dashboard/${modeChanged}/settings`,
    },
  ];

  const mainClienteLinks = [
    {
      text: "Vista General",
      icon: <HomeRoundedIcon />,
      route: `/dashboard/${modeChanged}`,
    },
    {
      text: "Detalles del caso",
      icon: <AnalyticsRoundedIcon />,
      route: `/dashboard/${modeChanged}/detalles-del-caso`,
    },
  ];

  const secondaryClienteListItems = [
    {
      text: "Configuracion del Sistema",
      icon: <SettingsRoundedIcon />,
      route: `/dashboard/${modeChanged}/settings`,
    },
  ];

  const handleNavigate = (route: string) => {
    setActiveMenu(0);
    router.replace(route);
  };
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      {modeChanged === "superuser" && (
        <>
          <List dense>
            {mainSuperUserLinks.map((item, index) => (
              <ListItem key={index} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  selected={index === activeMenu}
                  onClick={() => handleNavigate(item.route)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <List dense>
            {secondarySuperUserListItems.map((item, index) => (
              <ListItem key={index} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => {
                    handleNavigate(item.route);
                    setActiveMenu(-1);
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}
      {modeChanged === "aseguradora" && (
        <>
          <List dense>
            {mainAseguradoraLinks.map((item, index) => (
              <ListItem key={index} disablePadding sx={{ display: "block" }}>
                <ListItemButton selected={index === 0}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <List dense>
            {secondaryAseguradoraListItems.map((item, index) => (
              <ListItem key={index} disablePadding sx={{ display: "block" }}>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}
      {modeChanged === "peritos" && (
        <>
          <List dense>
            {mainPeritoLinks.map((item, index) => (
              <ListItem key={index} disablePadding sx={{ display: "block" }}>
                <ListItemButton selected={index === 0}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <List dense>
            {secondaryPeritoListItems.map((item, index) => (
              <ListItem key={index} disablePadding sx={{ display: "block" }}>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}
      {modeChanged === "talleres" && (
        <>
          <List dense>
            {mainTallerLinks.map((item, index) => (
              <ListItem key={index} disablePadding sx={{ display: "block" }}>
                <ListItemButton selected={index === 0}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <List dense>
            {secondaryTallerListItems.map((item, index) => (
              <ListItem key={index} disablePadding sx={{ display: "block" }}>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}
      {modeChanged === "clientes" && (
        <>
          <List dense>
            {mainTallerLinks.map((item, index) => (
              <ListItem key={index} disablePadding sx={{ display: "block" }}>
                <ListItemButton selected={index === 0}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <List dense>
            {secondaryTallerListItems.map((item, index) => (
              <ListItem key={index} disablePadding sx={{ display: "block" }}>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Stack>
  );
}
