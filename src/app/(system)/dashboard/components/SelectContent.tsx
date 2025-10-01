import * as React from "react";
import MuiAvatar from "@mui/material/Avatar";
import MuiListItemAvatar from "@mui/material/ListItemAvatar";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListSubheader from "@mui/material/ListSubheader";
import Select, { SelectChangeEvent, selectClasses } from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";

const Avatar = styled(MuiAvatar)(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.secondary,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 0,
  marginRight: 12,
});

export default function SelectContent({
  handleChange,
  valueChanged,
}: {
  handleChange: (event: SelectChangeEvent) => void;
  valueChanged?: string;
}) {
  return (
    <Select
      labelId="company-select"
      id="company-simple-select"
      value={valueChanged || ""}
      onChange={handleChange}
      displayEmpty
      inputProps={{ "aria-label": "Select company" }}
      fullWidth
      sx={{
        maxHeight: 56,
        width: 215,
        "&.MuiList-root": {
          p: "8px",
        },
        [`& .${selectClasses.select}`]: {
          display: "flex",
          alignItems: "center",
          gap: "2px",
          pl: 1,
        },
      }}
    >
      <ListSubheader sx={{ pt: 0 }}>Production</ListSubheader>
      <MenuItem value="superuser">
        <ListItemAvatar>
          <Avatar alt="Modo Super Usuario">
            <DevicesRoundedIcon sx={{ fontSize: "1rem" }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Modo Super Usuario" secondary="Todo el poder" />
      </MenuItem>
      <MenuItem value={"aseguradora"}>
        <ListItemAvatar>
          <Avatar alt="Modo Aseguradora">
            <SmartphoneRoundedIcon sx={{ fontSize: "1rem" }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Modo Aseguradora"
          secondary="Panel de Aseguradora"
        />
      </MenuItem>
      <MenuItem value={"peritos"}>
        <ListItemAvatar>
          <Avatar alt="Modo Peritos">
            <DevicesRoundedIcon sx={{ fontSize: "1rem" }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Modo Peritos" secondary="Panel de Peritos" />
      </MenuItem>
      <MenuItem value={"talleres"}>
        <ListItemAvatar>
          <Avatar alt="Modo Taller">
            <DevicesRoundedIcon sx={{ fontSize: "1rem" }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Modo Taller" secondary="Panel de Talleres" />
      </MenuItem>
      <MenuItem value={"clientes"}>
        <ListItemAvatar>
          <Avatar alt="Modo Cliente">
            <DevicesRoundedIcon sx={{ fontSize: "1rem" }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Modo Cliente" secondary="Panel de Clientes" />
      </MenuItem>
    </Select>
  );
}
