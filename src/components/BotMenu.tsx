import { Button, Menu } from "@mantine/core";
import { useState } from "react";
import { CgRedo, CgUndo } from "react-icons/cg";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  MdOutlineLocationSearching,
  MdOutlineMyLocation,
} from "react-icons/md";
import { PiSelectionAll } from "react-icons/pi";
import { RiExchange2Line } from "react-icons/ri";
import { TbMapCog } from "react-icons/tb";
import { mapOptions } from "../constants/options";
import { ChangeStatesType } from "../constants/types";

interface IBotMenu {
  changeStates: ChangeStatesType;
  setChangeStates: React.Dispatch<React.SetStateAction<ChangeStatesType>>;
  undoDrawing: () => void;
  redoDrawing: () => void;
}

const BotMenu = (props: IBotMenu) => {
  const { changeStates, setChangeStates, undoDrawing, redoDrawing } = props;
  const [showMenu, setShowMenu] = useState(true);

  return (
    <>
      <button
        onClick={() => setShowMenu((prev) => !prev)}
        className={`absolute z-30 bg-white left-[50%] bottom-20 translate-x-[-50%] rounded-t-lg w-16 h-6 flex items-center justify-center transition-transform duration-150 ${
          !showMenu && "translate-y-20"
        }`}
      >
        {!showMenu ? <IoIosArrowUp size={24} /> : <IoIosArrowDown size={24} />}
      </button>
      <div
        className={`absolute z-30 h-20 w-full  md:w-fit bg-white bottom-0 left-[50%] translate-x-[-50%] rounded-t-2xl shadow-md p-4 flex gap-4 justify-between items-center transition-transform duration-150 ${
          !showMenu && "translate-y-[100%]"
        }`}
      >
        <Menu>
          <Menu.Target>
            <Button
              variant="light"
              color={import.meta.env.VITE_PRIMARY_COLOR}
              style={{ width: 40, height: 40, padding: 1, borderRadius: "50%" }}
            >
              <TbMapCog size={20} />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Select Map</Menu.Label>
            {mapOptions.map((option, index) => (
              <Menu.Item
                key={index}
                color={
                  changeStates.mapStyle === option.value
                    ? import.meta.env.VITE_PRIMARY_COLOR
                    : undefined
                }
                onClick={() =>
                  setChangeStates((prev) => ({
                    ...prev,
                    mapStyle: option.value,
                  }))
                }
                leftSection={<img src={option.icon} className="w-4 h-4" />}
              >
                {option.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
        <Button
          color={import.meta.env.VITE_PRIMARY_COLOR}
          variant={changeStates.mylocation ? "filled" : "light"}
          onClick={() => {
            setChangeStates((prev) => ({
              ...prev,
              mylocation: !prev.mylocation,
            }));
          }}
          className="w-4 h-4"
          style={{ width: 40, height: 40, padding: 1, borderRadius: "50%" }}
        >
          {changeStates.mylocation ? (
            <MdOutlineMyLocation size={20} />
          ) : (
            <MdOutlineLocationSearching size={20} />
          )}
        </Button>
        <Button
          color={import.meta.env.VITE_PRIMARY_COLOR}
          variant={"light"}
          onClick={() => {
            undoDrawing();
          }}
          className="w-4 h-4"
          style={{ width: 40, height: 40, padding: 1, borderRadius: "50%" }}
        >
          <CgUndo size={20} />
        </Button>
        <Button
          color={import.meta.env.VITE_PRIMARY_COLOR}
          variant={"light"}
          onClick={() => {
            redoDrawing();
          }}
          className="w-4 h-4"
          style={{ width: 40, height: 40, padding: 1, borderRadius: "50%" }}
        >
          <CgRedo size={20} />
        </Button>
        <Button
          color={import.meta.env.VITE_PRIMARY_COLOR}
          variant={changeStates.select ? "filled" : "light"}
          onClick={() => {
            setChangeStates((prev) => ({
              ...prev,
              modify: false,
              select: !prev.select,
              drawMode: undefined,
              pointStyle: undefined,
            }));
          }}
          className="w-4 h-4"
          style={{ width: 40, height: 40, padding: 1, borderRadius: "50%" }}
        >
          <PiSelectionAll size={20} />
        </Button>
        <Button
          color={import.meta.env.VITE_PRIMARY_COLOR}
          variant={changeStates.modify ? "filled" : "light"}
          onClick={() => {
            setChangeStates((prev) => ({
              ...prev,
              select: false,
              modify: !prev.modify,
              drawMode: undefined,
              pointStyle: undefined,
            }));
          }}
          className="w-4 h-4"
          style={{ width: 40, height: 40, padding: 1, borderRadius: "50%" }}
        >
          <RiExchange2Line size={20} />
        </Button>
      </div>
    </>
  );
};
export default BotMenu;
