import { imageForPoint, pointStyles } from "../data/pointStyles";
import { Button, HoverCard, Indicator, Select } from "@mantine/core";
import Feature from "ol/Feature";
import Map from "ol/Map";
import View from "ol/View";
import { ScaleLine, defaults as defaultControls } from "ol/control";
import { getCenter } from "ol/extent";
import { Draw, defaults as defaultInteractions } from "ol/interaction";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { BingMaps, OSM } from "ol/source";
import VectorSource from "ol/source/Vector";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { getGeolocation } from "../methods/getGeolocation";

type ChangeStatesType = {
  draw: boolean;
  modify: boolean;
  snap: boolean;
  mapStyle: string | undefined;
  drawMode: any | undefined;
  pointStyle: string | undefined;
  features: Feature[];
};

const mapOptions = [
  "RoadOnDemand",
  "Aerial",
  "AerialWithLabelsOnDemand",
  "CanvasDark",
  // "OrdnanceSurvey",
];

const drawOptions = ["Point", "LineString", "Polygon", "Circle"];

const Playground = () => {
  const mapRef = useRef<any>(null);

  const [changeStates, setChangeStates] = useState<ChangeStatesType>({
    draw: false,
    modify: false,
    snap: false,
    mapStyle: undefined,
    drawMode: undefined,
    pointStyle: undefined,
    features: [],
  });

  console.log(getGeolocation());

  useEffect(() => {
    const source = new VectorSource({
      features: changeStates.features as any,
    });

    const layers: any = [
      new VectorLayer({
        source: source,

        style: {
          "fill-color": "rgba(255, 255, 255, 0.2)",
          "stroke-color": "#6366f1",
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
      if (changeStates.pointStyle) {
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
    return () => {
      map.dispose();
    };
  }, [changeStates.mapStyle, changeStates.drawMode, changeStates.pointStyle]);

  return (
    <section className={`w-full min-h-screen `}>
      <div
        id="map"
        ref={mapRef}
        className="map w-full h-screen border-2 border-white relative"
      >
        <div className="absolute top-2 right-12 z-20">
          <Select
            placeholder="OSM (default)"
            data={mapOptions}
            className="w-40"
            onChange={(e) => {
              if (e) {
                setChangeStates((prev) => ({ ...prev, mapStyle: e }));
              }
            }}
            clearable
            onClear={() =>
              setChangeStates((prev) => ({ ...prev, mapStyle: undefined }))
            }
          />
        </div>
        <div className="absolute top-2 left-12 z-20">
          <Select
            placeholder="Draw mode"
            data={drawOptions}
            className="w-32"
            onChange={(e) => {
              if (e) {
                setChangeStates((prev) => ({ ...prev, drawMode: e }));
              }
            }}
            clearable
            onClear={() =>
              setChangeStates((prev) => ({ ...prev, drawMode: undefined }))
            }
          />
        </div>
        {changeStates.drawMode === "Point" && (
          <div className="absolute top-16 left-2 z-20">
            <HoverCard width={280} shadow="md">
              <HoverCard.Target>
                <Indicator>
                  <Button
                    p={4}
                    h={30}
                    variant="filled"
                    color="#fff"
                    style={{ color: "#000" }}
                  >
                    <BsEmojiSmile />
                  </Button>
                </Indicator>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                {pointStyles.map((style) => (
                  <div key={style.title}>
                    <p>{style.title}</p>
                    <div className="flex flex-wrap">
                      {style.items.map((item) => (
                        <Button
                          key={item.title}
                          variant={
                            changeStates.pointStyle === item.title
                              ? "filled"
                              : "outline"
                          }
                          color={
                            changeStates.pointStyle === item.title
                              ? "#8b5cf6"
                              : "gray"
                          }
                          className="m-1"
                          onClick={() =>
                            setChangeStates((prev) => ({
                              ...prev,
                              pointStyle: item.title,
                            }))
                          }
                        >
                          <img
                            src={item.icon}
                            alt={item.title}
                            width={30}
                            height={30}
                          />
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </HoverCard.Dropdown>
            </HoverCard>
          </div>
        )}
      </div>
    </section>
  );
};
export default Playground;
