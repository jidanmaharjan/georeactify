import { Button } from "@mantine/core";
import { useState } from "react";
import { FaDrawPolygon, FaRegCircle } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoAnalyticsOutline } from "react-icons/io5";
import { TbBrushOff } from "react-icons/tb";
import { ChangeStatesType } from "../constants/types";
import { pointStyles } from "../data/pointStyles";

interface ISideMenu {
  changeStates: ChangeStatesType;
  setChangeStates: React.Dispatch<React.SetStateAction<ChangeStatesType>>;
}

const SideMenu = (props: ISideMenu) => {
  const { changeStates, setChangeStates } = props;
  const [showMenu, setShowMenu] = useState(true);
  return (
    <>
      <button
        onClick={() => setShowMenu((prev) => !prev)}
        className={`absolute z-30 bg-white top-[50%] left-32 translate-y-[-50%] rounded-r-lg w-6 h-16 flex items-center justify-center transition-transform duration-150 ${
          !showMenu && "-translate-x-32"
        }`}
      >
        {!showMenu ? (
          <IoIosArrowForward size={24} />
        ) : (
          <IoIosArrowBack size={24} />
        )}
      </button>
      <div
        className={`absolute z-30 w-32 h-fit  bg-white left-0 top-[50%] translate-y-[-50%] rounded-r-2xl shadow-md p-4 grid grid-cols-2 gap-2  transition-transform duration-150 ${
          !showMenu && "-translate-x-[100%]"
        }`}
      >
        <Button
          color={import.meta.env.VITE_PRIMARY_COLOR}
          variant={changeStates.drawMode === "LineString" ? "filled" : "light"}
          onClick={() => {
            setChangeStates((prev) => ({
              ...prev,
              modify: false,
              select: false,
              drawMode: "LineString",
              pointStyle: undefined,
            }));
          }}
          radius={"lg"}
          style={{ width: 40, height: 40, padding: 1 }}
        >
          <IoAnalyticsOutline size={20} />
        </Button>
        <Button
          color={import.meta.env.VITE_PRIMARY_COLOR}
          variant={changeStates.drawMode === "Polygon" ? "filled" : "light"}
          onClick={() => {
            setChangeStates((prev) => ({
              ...prev,
              modify: false,
              select: false,
              drawMode: "Polygon",
              pointStyle: undefined,
            }));
          }}
          radius={"lg"}
          style={{ width: 40, height: 40, padding: 1 }}
        >
          <FaDrawPolygon size={20} />
        </Button>
        <Button
          color={import.meta.env.VITE_PRIMARY_COLOR}
          variant={changeStates.drawMode === "Circle" ? "filled" : "light"}
          onClick={() => {
            setChangeStates((prev) => ({
              ...prev,
              modify: false,
              select: false,
              drawMode: "Circle",
              pointStyle: undefined,
            }));
          }}
          radius={"lg"}
          style={{ width: 40, height: 40, padding: 1 }}
        >
          <FaRegCircle size={20} />
        </Button>
        <Button
          color={import.meta.env.VITE_PRIMARY_COLOR}
          variant={
            changeStates.drawMode === "Point" &&
            changeStates.pointStyle === undefined
              ? "filled"
              : "light"
          }
          onClick={() => {
            setChangeStates((prev) => ({
              ...prev,
              modify: false,
              select: false,
              drawMode: "Point",
              pointStyle: undefined,
            }));
          }}
          radius={"lg"}
          style={{ width: 40, height: 40, padding: 1 }}
        >
          <GoDotFill size={20} />
        </Button>
        {pointStyles.map((style) =>
          style.items.map((item) => (
            <Button
              key={item.title}
              variant={
                changeStates.drawMode === "Point" &&
                changeStates.pointStyle === item.title
                  ? "filled"
                  : "light"
              }
              radius={"lg"}
              color={import.meta.env.VITE_PRIMARY_COLOR}
              style={{ width: 40, height: 40, padding: 1 }}
              onClick={() =>
                setChangeStates((prev) => ({
                  ...prev,
                  modify: false,
                  select: false,
                  drawMode: "Point",
                  pointStyle: item.title,
                }))
              }
            >
              <img src={item.icon} alt={item.title} width={24} height={24} />
            </Button>
          ))
        )}
        <Button
          color={import.meta.env.VITE_PRIMARY_COLOR}
          variant={"light"}
          onClick={() => {
            setChangeStates((prev) => ({
              ...prev,
              drawMode: undefined,
              pointStyle: undefined,
            }));
          }}
          className="col-span-2"
          radius={"lg"}
          style={{ height: 40, padding: 1 }}
        >
          <TbBrushOff size={20} />
        </Button>
      </div>
    </>
  );
};
export default SideMenu;
