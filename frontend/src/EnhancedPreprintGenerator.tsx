import React, {Component} from 'react';
import './EnhancedPreprintGenerator.css';
import './styles/globals.css';
import {PDFDocument} from 'pdf-lib'
import {parsePDF, PDFFile} from "./pdf/PDFParser";
import {createBibTexAnnotation} from "./pdf/PDFBibTexAnnotationGenerator";
import {PDFFileUploader} from "./pdf/PDFFileUploader";
import {PDFInfoForm} from "./pdf/PDFInfoForm";
import {RelatedPaperInfo, relatedPaperToString} from "./annotation/AnnotationAPI"
import {v4 as uuidv4} from 'uuid';
import config from "./config.json"
import {downloadLatexFiles} from "./latex/GenerateLatexFiles";
import {
    Button,
    CircularProgress
} from "@mui/material";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "./components/ui/Card";
import {InfoIcon, RefreshCw, Wifi, WifiOff} from "lucide-react";
import {Alert, AlertDescription} from "./components/ui/Alert";
import GitHubIcon from '@mui/icons-material/GitHub';
import ArticleIcon from "@mui/icons-material/Article";
import { Link } from 'react-router-dom';

const backendURL = process.env.REACT_APP_BACKEND_URL || config.backend_url;

const PDFJS = window.pdfjsLib;

interface AppProps {
}

interface AppState {
    apiConnected?: boolean;
    file?: PDFFile;
    loading: boolean;
    latex: boolean;
    bibTexEntries: { [p: string]: string };
    keywords: string[];
    similarPreprints: RelatedPaperInfo[];
}


interface StorePreprintArgs {
    title: string;
    keywords: string[];
    doi?: string;
    author?: string;
    url?: string;
    year?: string;
    annotation?: string;
    uuid: string
    file?: PDFFile;
}

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

async function getPDFText(base64File: string) {
    const pdfJSFile = await PDFJS.getDocument(base64File).promise
    const numPages = pdfJSFile.numPages;
    const firstPage = await (await pdfJSFile.getPage(1)).getTextContent()
    let text = '';
    for (let i = 2; i <= numPages; i++) {
        const page = await pdfJSFile.getPage(i)
        const pageText = await page.getTextContent();
        text += pageText.items.map((item: { str: any; }) => {
            return item.str
        }).join(" ")
    }
    return {firstPage: firstPage, text}
}

function saveByteArray(reportName: string, byte: Uint8Array) {
    const blob = new Blob([byte], {type: "application/pdf"});
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = reportName;
    link.click();
}

export async function requestPreprints(title: string, keywords: string[]) {
    let response
    try {
        response = await fetch(`${backendURL}/database/getRelatedPreprints?keywords=${JSON.stringify(keywords)}`)
    } catch (e) {
        return undefined
    }

    const result: RelatedPaperInfo[] = JSON.parse(await response.text())
    return result.filter((preprint) => {
        return preprint.title !== title
    })
}

class EnhancedPreprintGenerator extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            apiConnected: false,
            loading: false,
            latex: false,
            bibTexEntries: {},
            keywords: [],
            similarPreprints: []
        };
    }

    callAPI() {
        fetch(`${backendURL}/testAPI`)
            .then(res => res.text())
            .then(_ => this.setState({apiConnected: true})).catch(() => {
            this.setState({apiConnected: false})
        });
    }


    async storePreprint(args: StorePreprintArgs) {
        const {title, keywords, doi, author, url, year, annotation, uuid, file} = args;

        let file_base64 = '';
        if (file) {
            file_base64 = await file.file.saveAsBase64();
        }

        const payload = {
            id: uuid,
            title: title,
            keywords: keywords,
            doi: doi,
            author: author,
            url: url,
            year: year,
            annotation: annotation,
            file: file_base64, // Base64 encoded file
        };

        fetch(`${backendURL}/database/storePreprint`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(_ => {
            // Handle success
        }).catch(_ => {
            // Handle error
        });
    }


    componentWillMount() {
        this.callAPI();
    }

    componentDidMount() {
        // Set document title for SEO
        document.title = "CiteAssist - Generate BibTeX Entries for Academic Papers";
        
        // Set meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', 'Upload your academic paper and automatically generate BibTeX entries, extract metadata, and find related papers with CiteAssist.');
        
        // Set meta keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.setAttribute('name', 'keywords');
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', 'BibTeX generation, citation tool, academic papers, research, PDF annotation, metadata extraction');
    }

    render() {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-3 px-4 font-medium shadow-md">
                This is a free non-commercial service provided by the <a href="https://uni-goettingen.de/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80 transition-colors">University of Göttingen</a>.
            </header>

                <div className="min-h-screen flex items-center justify-center overflow-y-auto py-8">
                    <Card className="w-full max-w-4xl mx-auto bg-white shadow-2xl border border-indigo-100">
                        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-lg">
                            <CardTitle className="font-bold text-center text-white">
                                <h1 className="text-3xl"><Link to="/">CiteAssist</Link></h1>
                                <p className="text-blue-100 text-lg mt-2 font-normal">
                                    Generate BibTeX entries and annotate your academic papers
                                </p>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {this.state.file && (
                                <div className="flex justify-between items-center mb-6">
                                    <Button 
                                        onClick={() => { this.setState({file: undefined}) }} 
                                        className="flex items-center gap-2 hover:bg-gray-100"
                                    >
                                        <RefreshCw size={16}/>
                                        RESET
                                    </Button>
                                    <div className="px-3 py-1.5 bg-blue-50 text-blue-800 rounded border border-blue-200">
                                        {this.state.file.name}
                                    </div>
                                </div>
                            )}

                            {!this.state.file && !this.state.loading ? (
                                <div className="flex justify-center items-center flex-col py-12">
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                                        Upload your academic paper
                                    </h2>
                                    <PDFFileUploader handleChange={async (file: File) => {
                                        this.setState({loading: true})
                                        let base64File = await toBase64(file)
                                        let pdfDoc = await PDFDocument.load(base64File)
                                        const pdfText = await getPDFText(base64File);
                                        const info = await parsePDF(file, pdfDoc, pdfText, file.name)
                                        let pdfFile: PDFFile = {
                                            name: file.name,
                                            file: pdfDoc,
                                            info: info
                                        }
                                        this.setState({
                                            file: pdfFile,
                                            loading: false
                                        })
                                    }}/>
                                </div>
                            ) : null}

                            {this.state.loading && (
                                <div className="flex justify-center items-center h-64">
                                    <CircularProgress/>
                                </div>
                            )}

                            {this.state.file && !this.state.loading && (
                                <PDFInfoForm
                                    file={this.state.file}
                                    onSubmit={async (bibTexEntries, keywords, similarPreprints, latex, upload) => await this.OnGeneration(bibTexEntries, keywords, similarPreprints, latex, upload)
                                    }/>
                            )}


                            {!this.state.apiConnected && (
                                <Alert variant="destructive" className="mt-6">
                                    <AlertDescription>
                                        Unable to connect to the backend. Some features may be unavailable.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                        <CardFooter className="bg-gray-50 p-4 rounded-b-lg border-t border-gray-200">
                            <div className="w-full flex justify-between items-center text-sm text-gray-600">
                                <a
                                    href="https://github.com/gipplab/preprint_generator"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
                                >
                                    <GitHubIcon/>
                                    View on GitHub
                                </a>
                                <a
                                    href="https://aclanthology.org/2024.sdp-1.10/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
                                >
                                    <ArticleIcon/>
                                    View on ACL Anthology
                                </a>
                                <Link
                                    to="/impressum"
                                    className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
                                >
                                    <InfoIcon/>
                                    Impressum
                                </Link>

                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        );
    }

    private async OnGeneration(bibTexEntries: {
        [p: string]: string
    }, keywords: string[], similarPreprints: RelatedPaperInfo[], latex = false, upload = false) {
        // Fix for error in the PDF-LIB library
        try {
            this.state.file!.file.getCreationDate()
        } catch (e) {
            this.state.file!.file.setCreationDate(new Date())
        }
        const fileBackup = await this.state.file!.file.copy()
        const uuid = uuidv4()
        const {text, bytes} = await createBibTexAnnotation(
            this.state.file!.file,
            uuid,
            bibTexEntries,
            similarPreprints,
            upload
        )
        const baseUrl = `${window.location.protocol}//${window.location.hostname}${(window.location.port) ? ":" : ""}${window.location.port}`;
        const url = `${baseUrl}/preprint/${uuid}`;
        if (upload) {
            await this.storePreprint({
                title: bibTexEntries["title"],
                keywords: keywords,
                doi: bibTexEntries["doi"],
                author: bibTexEntries["author"],
                url: bibTexEntries["url"] || url,
                year: bibTexEntries["year"],
                annotation: text,
                file: this.state.file,
                uuid: uuid
            })
        }
        if (latex) {
            downloadLatexFiles(text, bibTexEntries.url || url, bibTexEntries.confacronym, similarPreprints.map((preprint) => relatedPaperToString(preprint)), upload)
        } else {
            saveByteArray(this.state.file!.name, bytes);
        }
        this.setState({
            file: {
                file: fileBackup,
                info: this.state.file!.info,
                name: this.state.file!.name,
            }
        })
    };

}


export default EnhancedPreprintGenerator;
