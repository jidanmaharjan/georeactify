import { Feature } from "ol";
import { PointCoordType } from "ol/interaction/Draw";

export type ChangeStatesType = {
  draw: boolean;
  modify: boolean;
  snap: boolean;
  mapStyle: string | undefined;
  drawMode: any | undefined;
  pointStyle: string | undefined;
  features: Feature[];
  mylocation: boolean;
  viewCenter: {
    view: PointCoordType | undefined;
    zoom: number;
    rotation: number;
  };
};
