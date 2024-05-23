import {
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  cloneElement,
  createContext,
  useContext,
  useState
} from "react"
import { createPortal } from "react-dom"
import { HiXMark } from "react-icons/hi2"
import styled from "styled-components"
import { useClickOutside } from "../hooks/useClickOutside"

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--rounded-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
  max-height: 95dvh;
  overflow-y: auto;
  overflow-x: hidden;
  @media screen and (max-width: 31.25em) {
    padding: 3.2rem 2rem;
  }
`

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`
type ModalProps = {
  open: Dispatch<SetStateAction<string>>
  close: () => void
  openName: string
}
const ModalContext = createContext<ModalProps>({
  close: () => {},
  openName: "",
  open: () => {}
})

function Modal({ children }: { children: ReactNode }) {
  const [openName, setOpenName] = useState("")

  const close = () => setOpenName("")
  const open = setOpenName

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  )
}

function Open({
  children,
  opens: opensWindowName
}: {
  children: ReactElement
  opens: string
}) {
  const { open } = useContext(ModalContext)

  return cloneElement(children, { onClick: () => open(opensWindowName) })
}

function Window({ children, name }: { children: ReactElement; name: string }) {
  const { openName, close } = useContext(ModalContext)
  const ref = useClickOutside(close)

  if (name !== openName) return null

  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <HiXMark />
        </Button>

        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </StyledModal>
    </Overlay>,
    document.body
  )
}

Modal.Open = Open
Modal.Window = Window
Modal.Button = Button

export default Modal
