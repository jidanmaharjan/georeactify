import { Button, Menu, Select, rem } from "@mantine/core";
import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { ChangeStatesType } from "../constants/types";
import { mapOptions } from "../constants/options";
import { TbMapCog } from "react-icons/tb";

interface IBotMenu {
  changeStates: ChangeStatesType;
  setChangeStates: React.Dispatch<React.SetStateAction<ChangeStatesType>>;
}

const BotMenu = (props: IBotMenu) => {
  const { changeStates, setChangeStates } = props;
  const [showMenu, setShowMenu] = useState(false);
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
        className={`absolute z-30 h-20 w-full  md:w-[50%] bg-white bottom-0 left-[50%] translate-x-[-50%] rounded-t-2xl shadow-md  transition-transform duration-150 ${
          !showMenu && "translate-y-[100%]"
        }`}
      >
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
        <Menu>
          <Menu.Target>
            <Button>
              <TbMapCog />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Select Map</Menu.Label>
            {mapOptions.map((option) => (
              <Menu.Item>{option.label}</Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </div>
    </>
  );
};
export default BotMenu;
