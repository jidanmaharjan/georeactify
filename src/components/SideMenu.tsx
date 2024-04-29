import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const SideMenu = () => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <>
      <button
        onClick={() => setShowMenu((prev) => !prev)}
        className={`absolute z-30 bg-white top-[50%] left-20 translate-y-[-50%] rounded-r-lg w-6 h-16 flex items-center justify-center transition-transform duration-150 ${
          !showMenu && "-translate-x-20"
        }`}
      >
        {!showMenu ? (
          <IoIosArrowForward size={24} />
        ) : (
          <IoIosArrowBack size={24} />
        )}
      </button>
      <div
        className={`absolute z-30 w-20 h-[80vh]  bg-white left-0 top-[50%] translate-y-[-50%] rounded-r-2xl shadow-md  transition-transform duration-150 ${
          !showMenu && "-translate-x-[100%]"
        }`}
      ></div>
    </>
  );
};
export default SideMenu;
