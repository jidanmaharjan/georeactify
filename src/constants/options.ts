import osm from "../assets/icons/map.png";
import roads from "../assets/icons/road.png";
import satellite from "../assets/icons/signal-satellite.png";
import satelliteLabel from "../assets/icons/treasure-map.png";
import darkmap from "../assets/icons/darkmap.png";

export const mapOptions = [
  {
    value: "",
    label: "OSM (default)",
    icon: osm,
  },
  {
    value: "RoadOnDemand",
    label: "Road Only",
    icon: roads,
  },
  {
    value: "Aerial",
    label: "Satellite View (No Labels)",
    icon: satellite,
  },
  {
    value: "AerialWithLabelsOnDemand",
    label: "Satellite View (With Labels)",
    icon: satelliteLabel,
  },
  {
    value: "CanvasDark",
    label: "Dark Map",
    icon: darkmap,
  },
];
