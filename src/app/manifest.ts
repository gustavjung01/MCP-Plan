import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MCP-Plan",
    short_name: "MCP-Plan",
    description: "Quan ly NPP, tuyen ban hang, don hang va ke hoach hanh dong.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f5f7fb",
    theme_color: "#101828",
    orientation: "portrait"
  };
}
