import { ReactNode } from "react";
import "./popup.css";

interface PopUpProps {
  children: ReactNode;
  isOpen: boolean;
}

function PopUp({ children, isOpen }: PopUpProps) {
  return (
    <div className={isOpen ? "popup active" : "popup"} draggable="false">
      {children}
    </div>
  );
}

export default PopUp;
