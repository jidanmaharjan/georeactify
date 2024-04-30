import { Button } from "@mantine/core";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RiExchange2Line } from "react-icons/ri";
import { ChangeStatesType } from "../constants/types";
import { FaDrawPolygon, FaRegCircle } from "react-icons/fa";
import { IoAnalyticsOutline } from "react-icons/io5";
import { pointStyles } from "../data/pointStyles";
import { GoDotFill } from "react-icons/go";

interface ISideMenu {
  changeStates: ChangeStatesType;
  setChangeStates: React.Dispatch<React.SetStateAction<ChangeStatesType>>;
}

const SideMenu = (props: ISideMenu) => {
  const { changeStates, setChangeStates } = props;
  const [showMenu, setShowMenu] = useState(false);
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
                  drawMode: "Point",
                  pointStyle: item.title,
                }))
              }
            >
              <img src={item.icon} alt={item.title} width={24} height={24} />
            </Button>
          ))
        )}
      </div>
    </>
  );
};
export default SideMenu;
