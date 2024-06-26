// import SunEditor from "suneditor-react"
// import "suneditor/dist/css/suneditor.min.css" // Import Sun Editor's CSS File
// const customOptions = {
//   buttonList: [
//     ["undo", "redo"],
//     ["font", "fontSize", "formatBlock"],
//     ["bold", "underline", "italic", "strike", "subscript", "superscript"],
//     ["fontColor", "hiliteColor", "textStyle"],
//     ["removeFormat"],
//     ["outdent", "indent"],
//     // ["align", "horizontalRule", "list", "table"],
//     ["align", "horizontalRule", "list"],
//     ["link"],
//     // ["link", "image", "video"],
//     // ["fullScreen", "showBlocks", "codeView"]
//     ["fullScreen", "showBlocks"]
//   ],
//   height: "auto"
// }
// const Editor = ({ defaultValue , name="texte" }: { defaultValue: string , name : string }) => {
//   return (
//     <SunEditor
//       setDefaultStyle="font-family: Poppins, sans-serif; font-size: 1.6rem;"
//       setOptions={customOptions}
//       defaultValue={defaultValue}
//       // onChange={setContent}
//       name={name}
//     />
//   )
// }

// export default Editor


import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function EditorText({ defaultValue, name = "texte", onChange }: { defaultValue: string, name: string, onChange: (content: string) => void }) {
  const editorRef = useRef(null);
  const textareaRef = useRef(null);
                             

  return (
    <>
      <Editor
        apiKey="6kqstarlut29zlefi8jivx3mi7frl7vp0zzaebl3s2rx9nq9"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={defaultValue}
        onEditorChange={(content, editor) => { 
          console.log('content', content);
          
          // Update the hidden textarea value
          if (textareaRef.current) {
            textareaRef.current.value = content;
          }

          console.log('textareaRef.current.value',textareaRef.current.value);
          
          // Call the onChange callback with the updated content
          onChange(content);
        }}
        init={{
          height: 600,
        //   menubar: false,
          plugins:"markdown inlinecss typography autocorrect mergetags footnotes tableofcontents mentions powerpaste permanentpen tinymcespellchecker linkchecker formatpainter autolink charmap emoticons link lists searchreplace table wordcount mediaembed casechange export",
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough forecolor backcolor | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
          tinycomments_mode: "embedded",
          tinycomments_author: "Author name",
          mergetags_list: [
            { value: "First.Name", title: "First Name" },
            { value: "Email", title: "Email" },
          ],
         
        }}
      />
      <textarea
        ref={textareaRef}
        name={name}
        style={{ display: "none" }}
        defaultValue={defaultValue}
      />
    </>
  );

}
