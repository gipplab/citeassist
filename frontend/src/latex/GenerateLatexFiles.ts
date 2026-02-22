import {generateLatexSty} from "./LatexSty";
import {latexMD} from "./LatexMD";
import {generateLatexTex} from "./LatexTex";
import JSZip from 'jszip';
import {saveAs} from 'file-saver';

export function downloadLatexFiles(annotation: string, link: string | undefined, citeAssistLink: string | undefined, conferenceAcronym: string | null, relatedPapers: string[]): void {
    const styText = generateLatexSty(conferenceAcronym);
    const basicTexContent = generateLatexTex(annotation, link, citeAssistLink, relatedPapers);
    const texText = String.raw`
\clearpage
\onecolumn
\hypertarget{annotation}{}
\pagestyle{empty}
${basicTexContent}
`;

    const zip = new JSZip();
    zip.file('annotation.sty', styText);
    zip.file('annotation.tex', texText);
    zip.file('instructions.md', latexMD);

    zip.generateAsync({type: 'blob'})
        .then(function (blob) {
            saveAs(blob, 'latex_files.zip');
        });
}