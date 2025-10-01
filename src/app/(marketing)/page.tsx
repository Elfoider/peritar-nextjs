"use client";
import LogoCollection from "./components/LogoCollection";
import Highlights from "./components/Highlights";
import Pricing from "./components/Pricing";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Divider from "@mui/material/Divider";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      <LogoCollection />
      {/* <Features />
      <Divider />
      <Testimonials />
      <Divider /> */}
      <Highlights />
      {/* <Divider />
      <Pricing />
      <Divider />
      <FAQ /> */}
    </>
  );
}
