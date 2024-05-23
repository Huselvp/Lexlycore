import SunEditor from "suneditor-react"
import "suneditor/dist/css/suneditor.min.css" // Import Sun Editor's CSS File
const customOptions = {
  buttonList: [
    ["undo", "redo"],
    ["font", "fontSize", "formatBlock"],
    ["bold", "underline", "italic", "strike", "subscript", "superscript"],
    ["fontColor", "hiliteColor", "textStyle"],
    ["removeFormat"],
    ["outdent", "indent"],
    // ["align", "horizontalRule", "list", "table"],
    ["align", "horizontalRule", "list"],
    ["link"],
    // ["link", "image", "video"],
    // ["fullScreen", "showBlocks", "codeView"]
    ["fullScreen", "showBlocks"]
  ],
  height: "auto"
}
const Editor = ({ defaultValue , name="texte" }: { defaultValue: string , name : string }) => {
  return (
    <SunEditor
      setDefaultStyle="font-family: Poppins, sans-serif; font-size: 1.6rem;"
      setOptions={customOptions}
      defaultValue={defaultValue}
      // onChange={setContent}
      name={name}
    />
  )
}

export default Editor
