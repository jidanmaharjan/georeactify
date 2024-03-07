import demo from "../assets/demo.png";

import { Feature } from "ol";
import Map from "ol/Map.js";
import View from "ol/View.js";
import { Coordinate } from "ol/coordinate";
import { getCenter } from "ol/extent";
import { Circle, LineString, Point, Polygon } from "ol/geom";
import { Draw, Modify, Snap } from "ol/interaction";
import { Vector as VectorLayer } from "ol/layer.js";
import ImageLayer from "ol/layer/Image";
import "ol/ol.css";
import { Projection } from "ol/proj";
import { Vector as VectorSource } from "ol/source.js";
import Static from "ol/source/ImageStatic";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import { useEffect, useRef, useState } from "react";

type DrawModeType = "Point" | "LineString" | "Polygon";

const dummyData = [
  [392.8494061138115, 466.6000143742211],
  [496.8063133136243, 589.8000067816838],
  [559.9801198147956, 426.60001584850016],
  [437.9840896987797, 378.4511306825208],
  [392.8494061138115, 466.6000143742211],
];
const dummyData2 = [
  [679.3074695112618, 382.9387015166072],
  [876.1899890654389, 487.3404312870686],
  [902.0105773963847, 372.1756332056031],
  [789.045216162727, 277.4605992224897],
  [675.0040107622214, 245.17143534732475],
  [611.5282199384079, 289.30004005714966],
  [679.3074695112618, 382.9387015166072],
];
type DrawDataType = {
  type: string;
  coordinates: number[][];
};

const Playground = () => {
  const mapRef = useRef<any>(null);
  const [drawMode, setDrawMode] = useState<DrawModeType>("LineString");
  const [drawData, setDrawData] = useState<DrawDataType[]>(
    localStorage.getItem("drawData")
      ? JSON.parse(localStorage.getItem("drawData") || "")
      : []
  );
  const [scaling, setScaling] = useState(false);
  const [saveState, setSaveState] = useState(false);
  const [saveItems, setSaveItems] = useState<DrawDataType | null>(null);
  const vectorLayerRef = useRef<any>(null);

  const [scaleData, setScaleData] = useState(
    localStorage.getItem("scalingData")
      ? JSON.parse(localStorage.getItem("scalingData") || "")
      : null
  );

  const getUnitScale = () => {
    if (scaleData) {
      const feature = new Feature({
        geometry: new LineString(scaleData.coordinates),
      });
      const length = feature.getGeometry()?.getLength() || 0;
      const scale = scaleData.value / length;
      return scale;
    }
    return 1;
  };

  const getLength = (item:DrawDataType) => {
    if (item.type === "LineString") {
      const feature = new Feature({
        geometry: new LineString(item.coordinates),
      });
      const totalLength = feature.getGeometry()?.getLength() || 0;
      return totalLength * getUnitScale();
    }
    return "0";
  };

  useEffect(() => {
    const extent = [0, 0, 1024, 968];
    const projection = new Projection({
      code: "xkcd-image",
      units: "pixels",
      extent: extent,
    });
    const map = new Map({
      target: mapRef.current,
      layers: [
        new ImageLayer({
          source: new Static({
            url: demo,
            imageExtent: extent, // Set the image extent according to your image dimensions
            projection: projection,
          }),
        }),
      ],
      view: new View({
        projection: projection,
        center: getCenter(extent),
        zoom: 2,
        maxZoom: 8,
      }),
    });

    const features:any = [];
    if (scaleData) {
      const newScaleData = new Feature({
        geometry: new LineString(scaleData?.coordinates),
      });
      features.push(newScaleData);
    }

    drawData.forEach((item) => {
      if (item.type === "LineString") {
        const newLine = new Feature({
          geometry: new LineString(item.coordinates),
        });
        features.push(newLine);
      }
      if (item.type === "Polygon") {
        const newPolygon = new Feature({
          geometry: new Polygon([item.coordinates]),
        });
        features.push(newPolygon);
      }
      if (item.type === "Point") {
        const newPoint = new Feature({
          geometry: new Point(item.coordinates as any),
        });
        features.push(newPoint);
      }
    });

    console.log(features);

    const source = new VectorSource({
      features: [...features],
    });
    const vector = new VectorLayer({
      source: source,
      // style: new Style({
      //   fill: new Fill({
      //     color: "rgba(255, 255, 255, 0.2)",
      //   }),
      //   stroke: new Stroke({
      //     color: "#ffcc33",
      //     width: 2,
      //   }),
      //   image: new Circle({
      //     color: "#ffcc33",
      //     width: 2,
      //   })
      // }),
      style: {
        'fill-color': 'rgba(255, 255, 255, 0.2)',
        'stroke-color': '#ffcc33',
        'stroke-width': 2,
        'circle-radius': 7,
        'circle-fill-color': '#f43f5e',
      },
    });
    vectorLayerRef.current = vector;
    map.addLayer(vector);

    const draw = new Draw({
      source: source,
      type: drawMode,
    });
    map.addInteraction(draw);

    // const modify = new Modify({ source: source });
    // map.addInteraction(modify);

    // modify.on("modifyend", (event: any) => {
    //   console.log('modified');
      
    // })

    const snap = new Snap({ source: source });
    map.addInteraction(snap);

    draw.on("drawend", (event: any) => {
      if (scaling) {
        const scaleDataToSet = {
          type: "scale",
          value: 20,
          unit: "m",
          coordinates: event.feature.getGeometry()?.getCoordinates(),
        };
        localStorage.setItem("scalingData", JSON.stringify(scaleDataToSet));
        setScaleData(scaleDataToSet);
        setScaling(false);
      } else {
        const feature = event.feature;
        setSaveItems({
          type: drawMode,
          coordinates: feature.getGeometry()?.getCoordinates(),
        });
        setSaveState(true);
      }
    });

    document.getElementById("undo")?.addEventListener("click", function () {
      draw.removeLastPoint();
    });

    return () => {
      map.removeInteraction(draw);
      // map.removeInteraction(modify);
      map.removeInteraction(snap);
      map.dispose();
    };
  }, [drawMode, scaling, drawData, scaleData]);

  console.log(scaling);

  const clearAll = () => {
    const vectorSource = vectorLayerRef.current.getSource();
    vectorSource.clear();
  };

  return (
    <div className="min-h-screen pt-20 w-4/5 mx-auto flex flex-col gap-4">
      {/* <img src={demo} alt="" /> */}
      {saveState ? (
        <div className="w-full h-screen fixed top-0 left-0 bg-slate-600/50 z-50 flex flex-col gap-4 justify-center items-center text-white">
          <h2>Do you want to save?</h2>
          <div className="flex gap-4">
            <button
              className="p-2 border border-gray-300"
              onClick={() => {
                setSaveState(false);
                setSaveItems(null);
              }}
            >
              Cancel
            </button>
            <button
              className="p-2 border border-gray-300"
              onClick={() => {
                localStorage.setItem(
                  "drawData",
                  JSON.stringify([...drawData, saveItems])
                );
                setDrawData([...drawData, saveItems] as any);
                setSaveState(false);
                setSaveItems(null);
              }}
            >
              Save
            </button>
          </div>
        </div>
      ) : null}
      <div
        id="map"
        ref={mapRef}
        className="map w-full h-[500px] border-2 border-blue-300"
        style={{ background: demo }}
      ></div>
      <div className=" flex gap-4 items-center">
        <button className="p-2 border border-gray-300" id="undo">
          Undo
        </button>
        <button
          onClick={clearAll}
          className="p-2 border border-gray-300"
          id="clear"
        >
          Clear
        </button>
        <button
          onClick={() => {
            setDrawMode("LineString");
            setScaling(true);
          }}
          className="p-2 border border-gray-300"
        >
          Set Scale
        </button>
        <select
        className="p-2 bg-white border border-gray-300"
          value={drawMode}
          onChange={(e) => setDrawMode(e.target.value as DrawModeType)}
        >
          {["Point", "LineString", "Polygon"].map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
        <p>
          {scaling ? (
            "Scaling"
          ) : (
            <p>Scale: {`${scaleData?.value ||''} ${scaleData?.unit || ''}`}</p>
          )}
        </p>
      </div>
      <div>
        <h2>Drawn Items</h2>
        <ul className="flex flex-col gap-2">
          {drawData.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-4 border border-blue-300 p-1"
            >
              <p>{item.type}</p>
              <p>
                {getLength(item)} {scaleData?.unit}
              </p>
              <button
                onClick={() => {localStorage.setItem(
                  "drawData",
                  JSON.stringify(drawData.filter((_, i) => i !== index))
                );
                setDrawData(drawData.filter((_, i) => i !== index))}}
                className="p-1 border border-gray-300 ml-auto"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Playground;
