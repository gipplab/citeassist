import {FileUploader} from "react-drag-drop-files";
import React from "react";
import "../styles/globals.css"

const fileTypes = ["PDF"];

export function PDFFileUploader(props: { handleChange: (file: any) => Promise<void> }) {
    return (
        <div className="w-full max-w-md">
            <FileUploader
                classes="min-h-52 w-full rounded-xl border-2 border-dashed border-warm-border bg-cream hover:bg-cream-dark hover:border-accent-blue transition-colors cursor-pointer"
                handleChange={props.handleChange}
                name="file"
                types={fileTypes}
            />
        </div>
    )
}
