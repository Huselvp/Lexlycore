import { ReactNode } from "react";
import "./popUpContantContainer.css";
import { IoIosClose } from "react-icons/io";

interface PopUpProps {
  children: ReactNode;
}

function PopUpContentContainer({ children, onClose }: PopUpProps) {
  return (
    <div className="pop-up-content-container">
      <IoIosClose size={40} className="close" onClick={onClose} />

      {children}
    </div>
  );
}

export default PopUpContentContainer;
