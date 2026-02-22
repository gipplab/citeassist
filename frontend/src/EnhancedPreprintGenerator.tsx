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
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "./components/ui/Card";
import {InfoIcon, RefreshCw, Code2, Download, AlertTriangle, Check} from "lucide-react";
import {Alert, AlertDescription} from "./components/ui/Alert";
import {Textarea} from "./components/ui/Textarea";
import GitHubIcon from '@mui/icons-material/GitHub';
import ArticleIcon from "@mui/icons-material/Article";
import { Link } from 'react-router-dom';
import { env } from './config';
import {downloadLatexFiles} from "./latex/GenerateLatexFiles";
import {parseBibTex} from "./annotation/AnnotationParser";
import {
    Button,
    CircularProgress
} from "@mui/material";

const backendURL = env.BACKEND_URL;

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
    pdfGenerating: boolean;
    bibtexInput: string;
    bibtexError: string;
    bibtexSuccess: boolean;
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
            similarPreprints: [],
            pdfGenerating: false,
            bibtexInput: '',
            bibtexError: '',
            bibtexSuccess: false,
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
            file: file_base64,
        };

        fetch(`${backendURL}/database/storePreprint`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(_ => {
        }).catch(_ => {
        });
    }


    componentWillMount() {
        this.callAPI();
    }

    componentDidMount() {
        document.title = "CiteAssist - Generate BibTeX Entries for Academic Papers";

        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', 'Upload your academic paper and automatically generate BibTeX entries, extract metadata, and find related papers with CiteAssist.');

        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.setAttribute('name', 'keywords');
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', 'BibTeX generation, citation tool, academic papers, research, PDF annotation, metadata extraction');
    }

    handleBibtexDownload = () => {
        this.setState({ bibtexError: '', bibtexSuccess: false });

        if (!this.state.bibtexInput.trim()) {
            this.setState({ bibtexError: 'Please paste a BibTeX entry first.' });
            return;
        }

        const parsed = parseBibTex(this.state.bibtexInput);
        if (!parsed) {
            this.setState({ bibtexError: 'Could not parse the BibTeX entry. Please check the format.' });
            return;
        }

        const typeEntry = parsed.find(e => e.tag === 'type');
        const refEntry = parsed.find(e => e.tag === 'ref');
        const fieldEntries = parsed.filter(e => e.tag !== 'type' && e.tag !== 'ref');

        let annotation = `@${typeEntry?.value || 'misc'}{${refEntry?.value || 'unknown'}`;
        for (const entry of fieldEntries) {
            if (entry.value) {
                annotation += `,\n  ${entry.tag}={${entry.value}}`;
            }
        }
        annotation += "\n}";

        downloadLatexFiles(annotation, undefined, undefined, null, []);
        this.setState({ bibtexSuccess: true });
        setTimeout(() => this.setState({ bibtexSuccess: false }), 3000);
    };

    render() {
        return (
            <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #f5f3ff 50%, #faf5ff 100%)' }}>
                {/* Top Banner */}
                <header className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-2.5 px-4 text-sm font-medium">
                    Free non-commercial service by the{' '}
                    <a href="https://uni-goettingen.de/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-200 transition-colors">
                        University of Göttingen
                    </a>
                </header>

                {this.state.pdfGenerating && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="bg-white p-10 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm mx-4">
                            <CircularProgress size={56} sx={{ color: '#4f46e5' }} />
                            <h3 className="mt-5 text-xl font-semibold text-gray-900">Generating PDF...</h3>
                            <p className="mt-2 text-gray-500 text-center">This may take a few moments</p>
                        </div>
                    </div>
                )}

                <div className="flex-1 flex items-center justify-center overflow-y-auto py-8 px-4">
                    <Card className="w-full max-w-4xl mx-auto bg-white shadow-xl shadow-blue-500/5 border border-gray-200/80 rounded-2xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8">
                            <CardTitle className="font-bold text-center text-white">
                                <h1 className="text-3xl">
                                    <Link to="/" className="hover:text-blue-100 transition-colors">CiteAssist</Link>
                                </h1>
                                <p className="text-blue-100/90 text-lg mt-2 font-normal">
                                    Generate BibTeX entries and annotate your academic papers
                                </p>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            {this.state.file && (
                                <div className="flex justify-between items-center mb-6 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <Button
                                        onClick={() => { this.setState({file: undefined}) }}
                                        className="flex items-center gap-2"
                                        size="small"
                                    >
                                        <RefreshCw size={14}/>
                                        Reset
                                    </Button>
                                    <div className="px-3 py-1.5 bg-white text-blue-700 rounded-lg border border-blue-200 text-sm font-medium">
                                        {this.state.file.name}
                                    </div>
                                </div>
                            )}

                            {!this.state.file && !this.state.loading ? (
                                <div className="flex justify-center items-center flex-col py-10">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
                                        Upload your academic paper
                                    </h2>
                                    <p className="text-gray-500 mb-8 text-center">
                                        Drag & drop a PDF to extract metadata and generate citations
                                    </p>
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

                                    {/* BibTeX Quick Generate */}
                                    <div className="w-full mt-10">
                                        <div className="relative flex items-center justify-center my-6">
                                            <div className="border-t border-gray-200 w-full" />
                                            <span className="absolute bg-white px-4 text-sm text-gray-400 font-medium">or</span>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Code2 size={18} className="text-purple-600" />
                                                <h3 className="font-semibold text-gray-900">Generate LaTeX from BibTeX</h3>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-4">
                                                Paste a BibTeX entry to instantly download LaTeX citation files. No PDF needed.
                                            </p>
                                            <Textarea
                                                placeholder={`@article{example2024,\n  author={Author, First},\n  title={Paper Title},\n  year={2024}\n}`}
                                                rows={5}
                                                value={this.state.bibtexInput}
                                                onChange={(e) => this.setState({
                                                    bibtexInput: e.target.value,
                                                    bibtexError: '',
                                                    bibtexSuccess: false,
                                                })}
                                                className="font-mono text-sm bg-white mb-3"
                                            />
                                            {this.state.bibtexError && (
                                                <Alert variant="destructive" className="mb-3">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <AlertDescription>{this.state.bibtexError}</AlertDescription>
                                                </Alert>
                                            )}
                                            {this.state.bibtexSuccess && (
                                                <Alert className="mb-3 border-green-200 bg-green-50">
                                                    <Check className="h-4 w-4 text-green-600" />
                                                    <AlertDescription className="text-green-800">
                                                        LaTeX files downloaded!
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                            <button
                                                onClick={this.handleBibtexDownload}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all text-sm"
                                            >
                                                <Download size={16} />
                                                Download LaTeX Files
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {this.state.loading && (
                                <div className="flex flex-col justify-center items-center h-64">
                                    <CircularProgress sx={{ color: '#4f46e5' }} />
                                    <p className="mt-4 text-gray-500">Analyzing your PDF...</p>
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
                        <CardFooter className="bg-gray-50 p-5 border-t border-gray-100">
                            <div className="w-full flex justify-between items-center text-sm text-gray-500">
                                <a
                                    href="https://github.com/gipplab/preprint_generator"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 hover:text-gray-800 transition-colors"
                                >
                                    <GitHubIcon fontSize="small" />
                                    GitHub
                                </a>
                                <a
                                    href="https://aclanthology.org/2024.sdp-1.10/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 hover:text-gray-800 transition-colors"
                                >
                                    <ArticleIcon fontSize="small" />
                                    ACL Anthology
                                </a>
                                <Link
                                    to="/impressum"
                                    className="flex items-center gap-1.5 hover:text-gray-800 transition-colors"
                                >
                                    <InfoIcon size={16} />
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
        this.setState({ pdfGenerating: true });

        try {
            this.state.file!.file.getCreationDate()
        } catch (e) {
            this.state.file!.file.setCreationDate(new Date())
        }
        const fileBackup = await this.state.file!.file.copy()
        const uuid = uuidv4()

        try {
            const {text, bytes} = await createBibTexAnnotation(
                this.state.file!.file,
                upload ? uuid : undefined,
                bibTexEntries,
                similarPreprints
            )
            const baseUrl = `${window.location.protocol}//${window.location.hostname}${(window.location.port.length > 0) ? ":" : ""}${window.location.port}`;
            const url = upload ? `${baseUrl}/preprint/${uuid}` : undefined;
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
                downloadLatexFiles(text, bibTexEntries.url, url, bibTexEntries.confacronym, similarPreprints.map((preprint) => relatedPaperToString(preprint)))
            } else {
                saveByteArray(this.state.file!.name, bytes);
            }
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            this.setState({
                pdfGenerating: false,
                file: {
                    file: fileBackup,
                    info: this.state.file!.info,
                    name: this.state.file!.name,
                }
            });
        }
    };

}


export default EnhancedPreprintGenerator;
