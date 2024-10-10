import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function EditorText({
  defaultValue,
  name = "texte",
  onChange,
}: {
  defaultValue: string;
  name?: string;
  onChange?: (content: string) => void; // Make onChange optional
}) {
  const editorRef = useRef(null);
  const textareaRef = useRef(null);

  return (
    <>
      <Editor
        apiKey="6kqstarlut29zlefi8jivx3mi7frl7vp0zzaebl3s2rx9nq9"
        onInit={(editor) => (editorRef.current = editor)}
        initialValue={defaultValue}
        onEditorChange={(content) => {
          // Update the hidden textarea value
          if (textareaRef.current) {
            textareaRef.current.value = content;
          }

          // Call the onChange callback with the updated content
          onChange(content);
        }}
        init={{
          height: 600,
          //   menubar: false,
          plugins:
            "linkchecker autolink charmap emoticons link lists searchreplace table wordcount",
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
