import { Button } from "@mui/material";
import React from "react";

const FilePicker = ({ file, setFile, readFile }: any) => {
  return (
    <div className="filepicker-container">
      <div className="flex-1 flex flex-col">
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={(e: any) => setFile(e.target.files[0])}
        />
        <label htmlFor="file-upload" className="filepicker-label">
          Upload File
        </label>

        <p className="mt-2 text-gray-500 text-xs truncate">
          {file === "" ? "No file selected" : file.name}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          type="button"
          title="text"
          onClick={() => {
            readFile("logo");
          }}
        >
          Change Logo
        </Button>
        <Button type="button" title="Full" onClick={() => readFile("full")}>
          Change Fill
        </Button>
      </div>
    </div>
  );
};

export default FilePicker;
