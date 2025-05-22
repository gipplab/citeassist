import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ArrowRight, Info as InfoIcon, FileText, Coffee, Book, Users, Quote, Clipboard, Check } from 'lucide-react';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArticleIcon from "@mui/icons-material/Article";

const LandingPage = () => {
    const [copySuccess, setCopySuccess] = useState(false);
    
    const citationText = `@inproceedings{kaesberg-etal-2024-citeassist,
  author={Kaesberg, Lars and Ruas, Terry and Wahle, Jan Philip and Gipp, Bela},
  title={{C}ite{A}ssist: A System for Automated Preprint Citation and {B}ib{T}e{X} Generation},
  address={Bangkok, Thailand},
  booktitle={Proceedings of the Fourth Workshop on Scholarly Document Processing (SDP 2024)},
  editor={Ghosal, Tirthankar and Singh, Amanpreet and Waard, Anita and Mayr, Philipp and Naik, Aakanksha and Weller, Orion and Lee, Yoonjoo and Shen, Shannon and Qin, Yanxia},
  pages={105--119},
  publisher={Association for Computational Linguistics},
  url={https://aclanthology.org/2024.sdp-1.10/},
  year={2024},
  month={08}
}`;

    const handleCopyClick = async () => {
        try {
            await navigator.clipboard.writeText(citationText);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-3 px-4 font-medium shadow-md">
                This is a free non-commercial service provided by the <a href="https://uni-goettingen.de/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80 transition-colors">University of Göttingen</a>.
            </header>
            
            <nav className="bg-gray-50 py-2 px-4 flex justify-center gap-4 shadow-sm">
                <a
                    href="https://github.com/gipplab/preprint_generator"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors"
                    aria-label="View CiteAssist on GitHub"
                >
                    <GitHubIcon />
                    <span>View on GitHub</span>
                </a>
                <a
                    href="https://aclanthology.org/2024.sdp-1.10/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors"
                    aria-label="View CiteAssist paper on ACL Anthology"
                >
                    <ArticleIcon />
                    <span>View on ACL Anthology</span>
                </a>
                <Link
                    to="/impressum"
                    className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors"
                    aria-label="View impressum page"
                >
                    <InfoIcon size={20} />
                    <span>Impressum</span>
                </Link>
                <Link
                    to="/app"
                    className="flex items-center gap-2 ml-4 px-4 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    aria-label="Go directly to the app"
                >
                    <ArrowRight size={18} />
                    <span>Go to App</span>
                </Link>
            </nav>
            
            <main className="flex-grow flex items-center justify-center p-4">
                <Card className="w-full max-w-3xl shadow-2xl border border-indigo-100 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-center">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            CiteAssist - Academic Citation Tool
                        </h1>
                        <CardDescription className="text-blue-100 text-lg">
                            Streamline your academic paper workflow
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-8">
                        <div className="space-y-6">
                            <section id="features">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                                    What CiteAssist can do for you
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    CiteAssist automates BibTeX entry generation for academic papers. It extracts metadata
                                    (authors, titles, dates, keywords), embeds citations directly in PDFs, and links them on 
                                    the first page for easy access. The system also suggests related papers based on keywords, 
                                    enhancing your research workflow through our free web interface.
                                </p>
                                <div className="mt-4 mb-6">
                                    <a 
                                        href="https://citeassist.uni-goettingen.de/preprint/455b4527-da96-4c79-a434-18bc65646d3b"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                                    >
                                        <Book size={18} />
                                        <span>View Example Result</span>
                                        <ArrowRight size={16} />
                                    </a>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex flex-col items-center text-center">
                                            <FileText className="w-10 h-10 text-blue-500 mb-2" />
                                            <h3 className="text-lg font-medium text-gray-800 mb-1">BibTeX Generation</h3>
                                            <p className="text-sm text-gray-600">Generate perfect citations automatically</p>
                                        </div>
                                    </div>
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex flex-col items-center text-center">
                                            <Book className="w-10 h-10 text-blue-500 mb-2" />
                                            <h3 className="text-lg font-medium text-gray-800 mb-1">PDF Annotation</h3>
                                            <p className="text-sm text-gray-600">Enhance PDFs with embedded metadata</p>
                                        </div>
                                    </div>
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex flex-col items-center text-center">
                                            <Users className="w-10 h-10 text-blue-500 mb-2" />
                                            <h3 className="text-lg font-medium text-gray-800 mb-1">Find Related Papers</h3>
                                            <p className="text-sm text-gray-600">Discover relevant research</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section id="how-to-use">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                                    How to use CiteAssist
                                </h2>
                                <ul className="list-disc list-inside text-gray-600 space-y-2 leading-relaxed">
                                    <li>Upload your academic paper PDF</li>
                                    <li>CiteAssist will automatically extract metadata and generate BibTeX entries</li>
                                    <li>Browse related papers based on keywords</li>
                                    <li>Generate either LaTeX files or a new annotated PDF with embedded citations</li>
                                </ul>
                                <div className="mt-4">
                                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                        <h3 className="text-xl font-medium text-gray-800 mb-3">Result Options</h3>
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="flex-1">
                                                <p className="text-gray-600 mb-3">After processing, you have two options:</p>
                                                <ol className="list-decimal list-inside mt-2 space-y-3 text-gray-700">
                                                    <li>
                                                        <span className="font-medium">Upload option:</span> If you choose to upload, 
                                                        you'll get a <a 
                                                            href="https://citeassist.uni-goettingen.de/preprint/455b4527-da96-4c79-a434-18bc65646d3b" 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800 hover:underline"
                                                        >webpage like this example</a> with your annotated PDF
                                                    </li>
                                                    <li>
                                                        <span className="font-medium">Download only:</span> If you prefer, you can just download the 
                                                        annotated PDF with the embedded citations without saving it on our servers
                                                    </li>
                                                </ol>
                                                <p className="mt-4 text-sm text-gray-600">
                                                    Either way, your PDF will have BibTeX citations attached at the end and linked on the first page.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section id="citation">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center">
                                    <Quote size={20} className="mr-2 text-indigo-600" />
                                    Citation
                                </h2>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                                    <div className="flex justify-between items-center mb-3">
                                        <p className="text-gray-700 font-medium">If you use this tool, please cite it:</p>
                                        <button
                                            onClick={handleCopyClick}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-md transition-colors text-sm font-medium"
                                            aria-label="Copy citation to clipboard"
                                        >
                                            {copySuccess ? (
                                                <>
                                                    <Check size={16} />
                                                    <span>Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Clipboard size={16} />
                                                    <span>Copy to Clipboard</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <pre className="bg-white p-4 rounded border border-gray-200 text-sm overflow-x-auto font-mono text-gray-800">
{citationText}
                                    </pre>
                                </div>
                            </section>
                        </div>
                    </CardContent>
                    
                    <CardFooter className="p-8 flex flex-col items-center border-t border-gray-100 bg-gray-50">
                        <Link to="/app">
                            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-6 rounded-full text-lg flex items-center gap-3 shadow-xl transform transition-all hover:scale-105 hover:shadow-indigo-200 relative overflow-hidden group">
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                                <span className="relative z-10 font-bold">Get Started Now</span>
                                <ArrowRight size={22} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <div className="mt-6 text-center text-gray-500 text-sm">
                            Free for academic use | No registration required
                        </div>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
};

export default LandingPage; 