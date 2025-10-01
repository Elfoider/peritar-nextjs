"use client";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import { Stack } from "@mui/system";
import React from "react";
import Header from "../../components/Header";

export default function GestionUsuariosPage() {
  return (
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
        <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
          Gestion de Usuarios
        </Box>
      </Stack>
    </Box>
  );
}
