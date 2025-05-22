import {PDFDocument, PDFFont, PDFName, StandardFonts} from 'pdf-lib';
import {RelatedPaperInfo, relatedPaperToString} from "../annotation/AnnotationAPI";
import unidecode from "unidecode";
import axios from "axios";
import { env } from '../config';
import { generateLatexTex } from '../latex/LatexTex';

const backendURL = env.BACKEND_URL;

async function createCitationPDFWithLatex(uuid: string | undefined, size: { width: number, height: number }, bibTexEntries: {
    [id: string]: string
}, similarPreprints?: RelatedPaperInfo[]): Promise<{ pdf: ArrayBuffer, text: string }> {
    // Generate BibTeX citation text
    let bibAnnotationText = `@${bibTexEntries["artType"]}{${bibTexEntries["ref"]}`
    delete bibTexEntries["artType"]
    delete bibTexEntries["ref"]
    for (let key in bibTexEntries) {
        let value = bibTexEntries[key];
        if (value !== "") {
            bibAnnotationText += `,\n  ${key}={${value}}`
        }
    }
    bibAnnotationText += "\n}"

    // Generate link URL
    const baseUrl = `${window.location.protocol}//${window.location.hostname}${(window.location.port.length > 0) ? ":" : ""}${window.location.port}`;
    const url = uuid ? `${baseUrl}/preprint/${uuid}` : undefined;

    // Get related papers as strings
    const relatedPapersText = similarPreprints ? 
      similarPreprints.map(preprint => unidecode(relatedPaperToString(preprint))) :
      [];

    // Use the updated generateLatexTex function
    const latexContent = generateLatexTex(bibAnnotationText, bibTexEntries.url, url, relatedPapersText);

    // Create the complete LaTeX document
    const latexSource = String.raw`
\documentclass[12pt]{article}
\usepackage[utf8]{inputenc}
\usepackage{hyperref}
\usepackage{geometry}
\usepackage{tcolorbox}
\usepackage{xcolor}
\usepackage{tikz}
\usepackage{listings}
\tcbuselibrary{skins,breakable}

% Set paper size
\geometry{papersize={${size.width}pt,${size.height}pt}, margin=50pt}

\begin{document}
\pagestyle{empty}             % no page number

${latexContent}

\end{document}`;

    console.log("LaTeX source being sent to backend:", latexSource);

    try {
        // Send LaTeX source to backend for rendering
        const response = await axios.post(`${backendURL}/latex/process`, latexSource, {
            headers: {
                'Content-Type': 'text/plain'
            },
            responseType: 'arraybuffer'
        });
        
        // Return the PDF as ArrayBuffer and the BibTeX text
        return {
            pdf: response.data,
            text: bibAnnotationText
        };
    } catch (error) {
        console.error('Error generating PDF via LaTeX:', error);
        
        // Create a fallback PDF with pdf-lib as emergency solution
        console.log("Using fallback PDF generation method");
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([size.width, size.height]);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        
        page.drawText('Citation for this Paper', {
            x: size.width / 2 - 100,
            y: size.height - 50,
            font,
            size: 20
        });
        
        page.drawText('Error generating LaTeX citation.', {
            x: 50,
            y: size.height - 100,
            font,
            size: 12
        });
        
        page.drawText('BibTeX Citation:', {
            x: 50,
            y: size.height - 150,
            font,
            size: 12
        });
        
        // Draw BibTeX text in a simple format
        const lines = bibAnnotationText.split('\n');
        let yPosition = size.height - 180;
        
        for (const line of lines) {
            page.drawText(line, {
                x: 70,
                y: yPosition,
                font,
                size: 10
            });
            yPosition -= 15;
        }
        
        // Use a different approach to get ArrayBuffer from pdf-lib
        const pdfBytes = await pdfDoc.save();
        // Create a proper ArrayBuffer by copying bytes
        const arrayBuffer = new ArrayBuffer(pdfBytes.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < pdfBytes.length; i++) {
            view[i] = pdfBytes[i];
        }
        
        return {
            pdf: arrayBuffer,
            text: bibAnnotationText
        };
    }
}

async function mergePDFs(originalPdfDoc: PDFDocument, citationPdfBytes: ArrayBuffer, conferenceAcronym: string | null = null): Promise<PDFDocument> {
    const citationPdfDoc = await PDFDocument.load(citationPdfBytes);
    originalPdfDoc.getPageCount();
// Merge the PDFs
    const copiedPages = await originalPdfDoc.copyPages(citationPdfDoc, citationPdfDoc.getPageIndices());
    copiedPages.forEach(page => originalPdfDoc.addPage(page));

    // Add a button to the first page that links to the first page of the citation
    const firstPage = originalPdfDoc.getPage(0);
    const {width, height} = firstPage.getSize();

    let buttonImageBytes = await fetch("/citation_button.png").then((res) => res.arrayBuffer())
    let buttonImage = await originalPdfDoc.embedPng(buttonImageBytes)
    const buttonScale = 0.15;
    const buttonWidth = 758 * buttonScale;  // Set the button width
    const buttonHeight = 201 * buttonScale;  // Set the button height
    const buttonX = width - buttonWidth - 10;  // Position the button X pixels from the right edge
    const buttonY = height - buttonHeight - 10;  // Position the button Y pixels from the bottom edge
    const courierFont = await originalPdfDoc.embedFont(StandardFonts.CourierBold)
    firstPage.drawImage(buttonImage, {
        x: buttonX,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight
    })
    if (conferenceAcronym) {
        firstPage.drawText(conferenceAcronym, {
            x: 10,
            y: height - 20,
            size: 10,
            font: courierFont,

        })
    }
    let link = originalPdfDoc.context.register(
        originalPdfDoc.context.obj({
            Type: 'Annot',
            Subtype: 'Link',
            /* Bounds of the link on the page */
            Rect: [
                buttonX, // lower left x coord
                buttonY, // lower left y coord
                buttonX + buttonWidth, // upper right x coord
                buttonY + buttonHeight, // upper right y coord
            ],
            /* Give the link a 2-unit-wide border, with sharp corners */
            Border: [0, 0, 0],
            /* Make the border color blue: rgb(0, 0, 1) */
            C: [0, 0, 1],
            /* Page to be visited when the link is clicked */
            Dest: [copiedPages[0].ref, 'XYZ', null, null, null],
        }),
    );
    firstPage.node.set(PDFName.of('Annots'), originalPdfDoc.context.obj([link]));

    return originalPdfDoc;
}

export async function createBibTexAnnotation(file: PDFDocument, uuid: string | undefined, bibTexEntries: {
    [id: string]: string
}, similarPreprints?: any[]): Promise<{ text: string; bytes: Uint8Array; }> {

    try {
        // Create a PDF from the LaTeX content using the backend service
        const citation = await createCitationPDFWithLatex(uuid, file.getPage(0).getSize(), bibTexEntries, similarPreprints);
        const bibTexText = citation.text
        const bibTexBytes = citation.pdf

        // Merge the new citation PDF with the original PDF
        let pdfBytes = await mergePDFs(file, bibTexBytes, bibTexEntries.confacronym);

        // Return the annotation text (or modify as per your requirement)
        return {text: bibTexText, bytes: await pdfBytes.save()};
    } catch (error) {
        console.error("Error in createBibTexAnnotation:", error);
        throw error;
    }
}