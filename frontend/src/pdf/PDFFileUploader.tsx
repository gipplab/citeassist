import {FileUploader} from "react-drag-drop-files";
import React from "react";
import "../styles/globals.css"

const fileTypes = ["PDF"];

export function PDFFileUploader(props: { handleChange: (file: any) => Promise<void> }) {
    return (
        <div className="w-full max-w-md">
            <FileUploader
                classes="min-h-52 w-full rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400 transition-colors cursor-pointer"
                handleChange={props.handleChange}
                name="file"
                types={fileTypes}
            />
        </div>
    )
}
