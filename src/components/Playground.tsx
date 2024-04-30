import { Button, HoverCard, Indicator, Select } from "@mantine/core";
import Feature from "ol/Feature";
import Map from "ol/Map";
import View from "ol/View";
import { FullScreen, ScaleLine, defaults as defaultControls } from "ol/control";
import { getCenter } from "ol/extent";
import { Point } from "ol/geom";
import { Draw, Snap, defaults as defaultInteractions } from "ol/interaction";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import { BingMaps, OSM } from "ol/source";
import VectorSource from "ol/source/Vector";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import pin from "../assets/pointers/684908.png";
import { ChangeStatesType } from "../constants/types";
import { imageForPoint, pointStyles } from "../data/pointStyles";
import useGeoLocation from "../hooks/useGeoLocation";
import BotMenu from "./BotMenu";
import SideMenu from "./SideMenu";

const drawOptions = ["Point", "LineString", "Polygon", "Circle"];

const Playground = () => {
  const { coordinates } = useGeoLocation();
  const mapRef = useRef<any>(null);

  const [changeStates, setChangeStates] = useState<ChangeStatesType>({
    draw: false,
    modify: false,
    snap: false,
    mapStyle: undefined,
    drawMode: undefined,
    pointStyle: undefined,
    features: [],
    mylocation: false,
    viewCenter: {
      view: undefined,
      zoom: 2,
      rotation: 0,
    },
  });

  useEffect(() => {
    const source = new VectorSource({
      features: changeStates.features as any,
    });

    const layers: any = [
      new VectorLayer({
        source: source,

        style: {
          "fill-color": "rgba(255, 255, 255, 0.2)",
          "stroke-color": import.meta.env.VITE_PRIMARY_COLOR,
          "stroke-width": 2,
          "circle-radius": 5,
          "circle-fill-color": "#8b5cf6",
        },
      }),
    ];
    if (changeStates.mapStyle) {
      layers.unshift(
        new TileLayer({
          visible: true,
          preload: Infinity,
          source: new BingMaps({
            key: import.meta.env.VITE_BING_MAPS_API_KEY || "",
            imagerySet: changeStates.mapStyle,
            // placeholderTiles: false, // Optional. Prevents showing of BingMaps placeholder tiles
          }),
        })
      );
    }
    if (!import.meta.env.VITE_BING_MAPS_API_KEY || !changeStates.mapStyle) {
      layers.unshift(
        new TileLayer({
          source: new OSM(),
        })
      );
    }
    // main - map
    // let shiftPressed = false;
    // addEventListener("keydown", (e) => {
    //   if (e.key === "Shift") {
    //     shiftPressed = true;
    //   }
    // });
    // addEventListener("keyup", (e) => {
    //   if (e.key === "Shift") {
    //     shiftPressed = false;
    //   }
    // });
    const map = new Map({
      view: new View({
        center: getCenter([0, 0, 0, 0]),
        zoom: 2,
        maxZoom: 20,
      }),
      target: mapRef.current,
      layers: layers,
      interactions: defaultInteractions({
        // mouseWheelZoom: shiftPressed,
      }),
      controls: defaultControls().extend([
        new ScaleLine({
          units: "metric",
          bar: true,
          minWidth: 140,
        }),
        new FullScreen(),
      ]),
    });

    const draw = changeStates.drawMode
      ? new Draw({
          source: source,
          freehand: false,
          type: changeStates.drawMode,
          style:
            changeStates.drawMode === "Point" && changeStates.pointStyle
              ? new Style({
                  image: new Icon({
                    src: imageForPoint[changeStates.pointStyle],
                    scale: 0.1,
                    rotateWithView: true,
                    // rotation:
                    //   stateChanges.rotation[stateChanges.pointVariant] *
                    //   (Math.PI / 180),
                  }),
                })
              : undefined,
          stopClick: true,
          // condition: (e) => noModifierKeys(e) && primaryAction(e),
        })
      : null;
    if (draw) {
      map.addInteraction(draw);
    }
    draw?.on("drawend", (e) => {
      const featuresAfterDraw = source.getFeatures();

      const newFeature = e.feature;
      if (changeStates.pointStyle && changeStates.drawMode === "Point") {
        newFeature.setStyle(
          new Style({
            image: new Icon({
              src: imageForPoint[changeStates.pointStyle],
              scale: 0.1,
              rotateWithView: true,
              // rotation:
              //   stateChanges.rotation[stateChanges.pointVariant] *
              //   (Math.PI / 180),
            }),
          })
        );
      }

      setChangeStates((prev) => ({
        ...prev,
        features: [...featuresAfterDraw, newFeature],
      }));
    });

    const snap = new Snap({ source: source });
    map.addInteraction(snap);

    const view = map.getView();
    const handleViewChange = () => {
      const newRotation = view?.getRotation();
      const newZoom = view?.getZoom();
      const newCenter = view?.getCenter();
      if (newRotation || newZoom || newCenter) {
        setChangeStates((prev) => ({
          ...prev,
          viewCenter: {
            view: newCenter,
            zoom: newZoom || 2,
            rotation: newRotation / (Math.PI / 180),
          },
        }));
      }
    };

    view.on("change", handleViewChange);

    if (changeStates.mylocation) {
      if (coordinates) {
        const whereAmI = new Feature({
          geometry: new Point(
            fromLonLat([coordinates.longitude, coordinates.latitude])
          ),
        });
        whereAmI.setStyle(
          new Style({
            image: new Icon({
              src: imageForPoint["Pin"] || pin,
              scale: 0.1,
              rotateWithView: true,
              anchor: [0.5, 1],
              // rotation:
              //   stateChanges.rotation[stateChanges.pointVariant] *
              //   (Math.PI / 180),
            }),
          })
        );
        source.addFeature(whereAmI);
        map.getView().animate({
          duration: 0,
          center: fromLonLat([coordinates.longitude, coordinates.latitude]),
          zoom: 18,
        });
      }
    }
    return () => {
      map.dispose();
      if (draw) {
        map.removeInteraction(draw);
      }
      map.removeInteraction(snap);
    };
  }, [
    changeStates.mapStyle,
    changeStates.drawMode,
    changeStates.pointStyle,
    changeStates.mylocation,
  ]);

  return (
    <section className={`w-full min-h-screen `}>
      <div
        id="map"
        ref={mapRef}
        className="map w-full h-screen relative overflow-hidden"
      >
        <SideMenu
          changeStates={changeStates}
          setChangeStates={setChangeStates}
        />
        <BotMenu
          changeStates={changeStates}
          setChangeStates={setChangeStates}
        />
      </div>
    </section>
  );
};
export default Playground;
