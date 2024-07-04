import { ReactNode } from "react";
import "./popUpContantContainer.css";
import { IoIosClose } from "react-icons/io";
import { MdOutlineRemoveRedEye } from "react-icons/md";

interface PopUpProps {
  children: ReactNode;
}

function PopUpContentContainer({
  children,
  onClose,
  onSeeAllBlocks,
}: PopUpProps) {
  return (
    <div className="pop-up-content-container">
      <div className="close">
        <MdOutlineRemoveRedEye size={30} onClick={onSeeAllBlocks} />
        <IoIosClose size={30} onClick={onClose} />
      </div>

      {children}
    </div>
  );
}

export default PopUpContentContainer;
