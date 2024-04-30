import { Button } from "@mantine/core";
import { FiTrash } from "react-icons/fi";
import { PiPaintBrushBroad } from "react-icons/pi";
import { ChangeStatesType } from "../constants/types";

interface IConditionalMenu {
  changeStates: ChangeStatesType;
  setChangeStates: React.Dispatch<React.SetStateAction<ChangeStatesType>>;
  sourceInstance: any;
}

const ConditionalMenu = (props: IConditionalMenu) => {
  const { changeStates, setChangeStates, sourceInstance } = props;
  return (
    <>
      <div
        className={`absolute z-30 w-fit h-fit  right-4 bottom-24 p-4 flex flex-col gap-4`}
      >
        <Button
          color={import.meta.env.VITE_PRIMARY_COLOR}
          variant={"white"}
          onClick={() => {
            setChangeStates((prev) => ({
              ...prev,
              drawMode: undefined,
              pointStyle: undefined,
            }));
          }}
          radius={"xl"}
          style={{ width: 40, height: 40, padding: 1 }}
        >
          <FiTrash size={20} />
        </Button>
        {changeStates.features.length > 0 && (
          <Button
            color={import.meta.env.VITE_PRIMARY_COLOR}
            variant={"white"}
            onClick={() => {
              setChangeStates((prev) => ({
                ...prev,
                features: [],
              }));
              sourceInstance.clear();
            }}
            radius={"xl"}
            style={{ width: 40, height: 40, padding: 1 }}
          >
            <PiPaintBrushBroad size={20} />
          </Button>
        )}
      </div>
    </>
  );
};
export default ConditionalMenu;
