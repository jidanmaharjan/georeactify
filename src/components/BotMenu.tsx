import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const BotMenu = () => {
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
        className={`absolute z-30 h-20 w-full  md:w-[60%] bg-white bottom-0 left-[50%] translate-x-[-50%] rounded-t-2xl shadow-md  transition-transform duration-150 ${
          !showMenu && "translate-y-[100%]"
        }`}
      ></div>
    </>
  );
};
export default BotMenu;
