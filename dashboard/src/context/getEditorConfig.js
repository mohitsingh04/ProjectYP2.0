// editorConfig.js
import Swal from "sweetalert2";

export const getEditorConfig = () => ({
  readonly: false,
  uploader: {
    insertImageAsBase64URI: true,
    files: (files) => {
      const allowedTypes = ["image/jpeg", "image/png"];
      const maxSize = 100 * 1024;

      const validFiles = Array.from(files).filter((file) => {
        if (!allowedTypes.includes(file.type)) {
          Swal.fire({
            icon: "error",
            title: "Invalid File Type",
            text: "Only JPG and PNG files are allowed.",
          });
          return false;
        }

        if (file.size > maxSize) {
          Swal.fire({
            icon: "error",
            title: "File Too Large",
            text: "Image must be under 100KB.",
          });
          return false;
        }

        return true;
      });

      return validFiles;
    },
  },
  buttons: [
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    "ul",
    "ol",
    "|",
    "image",
    "link",
    "|",
    "undo",
    "redo",
    "|",
    "hr",
    "eraser",
    "source",
  ],
  events: {
    afterInsertImage: (node) => {
      // console.log("Image inserted:", node.src);
    },
    error: (error) => {
      Swal.fire({
        icon: "error",
        title: "Editor Error",
        text: error.message || "An error occurred in the editor",
      });
    },
  },
});
