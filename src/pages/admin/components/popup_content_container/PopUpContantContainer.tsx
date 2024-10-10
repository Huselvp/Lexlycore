// import { ReactNode } from "react";
// import "./popUpContantContainer.css";
// import { IoIosClose } from "react-icons/io";
// import { MdOutlineRemoveRedEye } from "react-icons/md";

// interface PopUpProps {
//   children: ReactNode;
// }

// function PopUpContentContainer({
//   children,
//   onClose,
//   onSeeAllBlocks,
//   isBlocksOpen,
// }: PopUpProps) {
//   return (
//     <div className="pop-up-content-container">
//       <div className="close">
//         {isBlocksOpen && (
//           <MdOutlineRemoveRedEye size={30} onClick={onSeeAllBlocks} />
//         )}
//         <IoIosClose size={30} onClick={onClose} />
//       </div>

//       {children}
//     </div>
//   );
// }

// export default PopUpContentContainer;

import { ReactNode } from "react";
import "./popUpContantContainer.css";
import { IoIosClose } from "react-icons/io";
import { MdOutlineRemoveRedEye } from "react-icons/md";

interface PopUpProps {
  children: ReactNode;
  onClose?: () => void; // Made optional
  onSeeAllBlocks?: () => void; // Made optional
  isBlocksOpen?: boolean; // Made optional
}

function PopUpContentContainer({
  children,
  onClose = () => {}, // Default to a no-op function
  onSeeAllBlocks = () => {}, // Default to a no-op function
  isBlocksOpen = false, // Default to false
}: PopUpProps) {
  return (
    <div className="pop-up-content-container">
      <div className="close">
        {isBlocksOpen && (
          <MdOutlineRemoveRedEye size={30} onClick={onSeeAllBlocks} />
        )}
        <IoIosClose size={30} onClick={onClose} />
      </div>

      {children}
    </div>
  );
}

export default PopUpContentContainer;
