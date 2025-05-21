import {generateLatexSty} from "./LatexSty";
import {latexMD} from "./LatexMD";
import {generateLatexTex} from "./LatexTex";
import JSZip from 'jszip';
import {saveAs} from 'file-saver';

function downloadFileFromText(content: string, filename: string): void {
    const blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

export function downloadLatexFiles(annotation: string, link: string, conferenceAcronym: string | null, relatedPapers: string[]): void {
    const styText = generateLatexSty(conferenceAcronym);
    
    // Get the basic TeX content
    const basicTexContent = generateLatexTex(annotation, link, relatedPapers);
    const texText = String.raw`
\clearpage
\hypertarget{annotation}{}
\pagestyle{empty}
${basicTexContent}
`;
    
    const mdText = latexMD;

    const zip = new JSZip();
    zip.file('annotation.sty', styText);
    zip.file('annotation.tex', texText);
    zip.file('instructions.md', mdText);

    zip.generateAsync({type: 'blob'})
        .then(function (blob) {
            saveAs(blob, 'latex_files.zip');
        });
}