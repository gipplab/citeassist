import {PDFDocument} from "pdf-lib";
import {extractKeywords} from "../languageProcessing/ExtractKeywords";
import { env } from '../config';

const backendURL = env.BACKEND_URL;

export interface PDFFile {
    name: string;
    file: PDFDocument;
    info: PDFInfo
}

export interface PDFInfo {
    artType: string;
    artTitle: string;
    title: string;
    volume?: number;
    issn?: string;
    number?: number;
    journal?: string;
    doi?: string;
    author?: string;
    pages: number;
    date: Date;
    keywords: string[]
}

export async function parsePDF(file: File, pdf: PDFDocument, text: {
    firstPage: any;
    text: string
}, name: string): Promise<PDFInfo> {
    const grobidData = await analyzeWithBackend(file)

    const maxHeight = Math.max(...text.firstPage.items.map((item: { height: number }) => {
        return item.height
    }))
    let artType = "article"
    let author = grobidData?.authors || pdf.getAuthor()
    let title = grobidData?.title || text.firstPage.items.filter((item: { height: number }) => {
        return item.height === maxHeight
    }).map((item: any) => {
        return item.str
    }).join("").trim().replace(/\s+/g, " ") || pdf.getTitle() || name.substring(0, name.length - 4).replace(/\s+/g, " ")
    let pages = pdf.getPageCount()
    let date = grobidData?.date || pdf.getCreationDate() || new Date()
    let volume
    let issn
    let number
    let journal = grobidData?.journal
    let doi
    let artTitle = ((author?.split(",")[0].split(" ").slice(-1)[0].toLowerCase()  || title).replace(/\s/g, '')) + date.getFullYear()
    let keywords: string[] = []
    if (grobidData?.keywords){
        grobidData.keywords.forEach((keyword) => keywords.push(keyword))
    }
    extractKeywords(text.text, 5).forEach((keyword) => keywords.push(keyword))

    return {artType, author, date, pages, artTitle, title, volume, issn, number, journal, doi, keywords}
}

async function analyzeWithBackend(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${backendURL}/extract`, { // Replace with your actual backend endpoint
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            return undefined
        }

        const data = await response.json();
        console.log(data)

        const title = data?.TEI?.teiHeader?.[0]?.fileDesc?.[0]?.titleStmt?.[0]?.title?.[0]?._
        const journal = data?.TEI?.teiHeader?.[0]?.fileDesc?.[0]?.publicationStmt?.[0]?.publisher?.[0]?._
        const dateString = data?.TEI?.teiHeader?.[0]?.fileDesc?.[0]?.publicationStmt?.[0]?.date?.[0]?.$?.when;
        const date = dateString ? new Date(Date.parse(dateString)) : undefined;
        const authorObject: any[] | undefined = data?.TEI?.teiHeader?.[0]?.fileDesc?.[0]?.sourceDesc?.[0]?.biblStruct?.[0]?.analytic?.[0]?.author
        const authors: string[] = [];
        authorObject?.forEach((author: any) => {
            if (author.persName) {
                authors.push(`${author.persName?.[0]?.surname?.[0]}, ${author.persName?.[0]?.forename?.[0]?.map((name: any) => name._).join(" ")}`)
            }
        })
        const keywords: string[] | undefined = data?.TEI?.teiHeader?.[0]?.profileDesc?.[0]?.textClass?.[0]?.keywords?.[0]?.term

        return {title: title, journal: journal, date: date, authors: authors.join(" and "), keywords: keywords};
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}
