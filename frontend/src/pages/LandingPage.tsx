import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import { Alert, AlertDescription } from "../components/ui/Alert";
import {
    ArrowRight, Info as InfoIcon, FileText, Book, Users, Quote, Clipboard, Check,
    Upload, Download, Search, Zap, ChevronDown, Code2, AlertTriangle
} from 'lucide-react';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArticleIcon from "@mui/icons-material/Article";
import { parseBibTex } from "../annotation/AnnotationParser";
import { downloadLatexFiles } from "../latex/GenerateLatexFiles";

const LandingPage = () => {
    const [copySuccess, setCopySuccess] = useState(false);
    const [bibtexInput, setBibtexInput] = useState('');
    const [bibtexError, setBibtexError] = useState('');
    const [bibtexSuccess, setBibtexSuccess] = useState(false);

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

    const handleBibtexDownload = () => {
        setBibtexError('');
        setBibtexSuccess(false);

        if (!bibtexInput.trim()) {
            setBibtexError('Please paste a BibTeX entry first.');
            return;
        }

        const parsed = parseBibTex(bibtexInput);
        if (!parsed) {
            setBibtexError('Could not parse the BibTeX entry. Please check the format.');
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
        setBibtexSuccess(true);
        setTimeout(() => setBibtexSuccess(false), 3000);
    };

    const steps = [
        { icon: Upload, title: "Upload PDF", description: "Drag & drop your academic paper" },
        { icon: Zap, title: "Auto-Extract", description: "Metadata is extracted automatically" },
        { icon: Search, title: "Find Related", description: "Discover related research papers" },
        { icon: Download, title: "Generate Output", description: "Get annotated PDF or LaTeX files" },
    ];

    const features = [
        {
            icon: FileText,
            title: "BibTeX Generation",
            description: "Automatically extract metadata and generate properly formatted BibTeX entries from your PDF papers."
        },
        {
            icon: Book,
            title: "PDF Annotation",
            description: "Embed citation information directly into your PDFs with a clickable link on the first page."
        },
        {
            icon: Users,
            title: "Related Papers",
            description: "Discover relevant research based on keywords and build a network of related work."
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Top Banner */}
            <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-2.5 px-4 text-sm font-medium">
                Free non-commercial service by the{' '}
                <a href="https://uni-goettingen.de/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-200 transition-colors">
                    University of Göttingen
                </a>
            </div>

            {/* Navigation */}
            <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 py-3 px-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        CiteAssist
                    </Link>
                    <div className="flex items-center gap-6">
                        <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">Features</a>
                        <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">How It Works</a>
                        <a href="#bibtex-tool" className="text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">Quick Generate</a>
                        <a
                            href="https://github.com/gipplab/preprint_generator"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-800 transition-colors"
                            aria-label="GitHub"
                        >
                            <GitHubIcon fontSize="small" />
                        </a>
                        <Link
                            to="/app"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                        >
                            Open App
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
                <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
                }} />
                <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8">
                        <Zap size={14} />
                        Automated Academic Citations
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                        Generate BibTeX entries
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            effortlessly
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Upload your PDF and CiteAssist will extract metadata, generate BibTeX entries,
                        annotate your paper, and help you discover related research.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/app">
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transition-all group">
                                Get Started
                                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <a href="#bibtex-tool">
                            <Button variant="outline" className="px-8 py-6 rounded-xl text-lg font-semibold border-2 hover:bg-gray-50 transition-all group">
                                <Code2 size={20} className="mr-2" />
                                Quick BibTeX
                                <ChevronDown size={16} className="ml-1 group-hover:translate-y-0.5 transition-transform" />
                            </Button>
                        </a>
                    </div>
                    <div className="mt-8 text-sm text-gray-500">
                        No registration required &middot; Free for academic use
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-16 px-6 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Everything you need for academic citations
                    </h2>
                    <div className="grid grid-cols-3 gap-5">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group flex items-start gap-3.5 p-5 rounded-xl bg-white border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-200"
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <feature.icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-base font-semibold text-gray-900 mb-1">{feature.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section id="how-it-works" className="py-16 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        How it works
                    </h2>
                    <div className="flex items-stretch justify-center gap-3 mb-8">
                        {steps.map((step, index) => (
                            <React.Fragment key={index}>
                                <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="text-base font-semibold text-gray-900 leading-tight">{step.title}</p>
                                        <p className="text-sm text-gray-500 leading-snug">{step.description}</p>
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <ArrowRight size={16} className="text-gray-300 flex-shrink-0 self-center" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="flex items-start gap-3.5 p-5 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <Upload size={18} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-base font-semibold text-gray-900">Upload &amp; Host</p>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Get a shareable{' '}
                                    <a href="https://citeassist.uni-goettingen.de/preprint/455b4527-da96-4c79-a434-18bc65646d3b"
                                       target="_blank" rel="noopener noreferrer"
                                       className="text-blue-600 hover:underline">webpage</a>{' '}
                                    with your annotated PDF.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3.5 p-5 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                <Download size={18} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-base font-semibold text-gray-900">Download Only</p>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Download annotated PDF or LaTeX files locally. No data leaves your browser.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-6">
                        <a
                            href="https://citeassist.uni-goettingen.de/preprint/455b4527-da96-4c79-a434-18bc65646d3b"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-base font-medium transition-colors"
                        >
                            <Book size={16} />
                            View an example result
                            <ArrowRight size={14} />
                        </a>
                    </div>
                </div>
            </section>

            {/* BibTeX Quick Generate */}
            <section id="bibtex-tool" className="py-16 px-6 bg-gray-50">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-3">
                            <Code2 size={14} />
                            Quick Tool
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Generate LaTeX files from BibTeX
                        </h2>
                        <p className="text-gray-600 max-w-lg mx-auto">
                            Paste a BibTeX entry below to instantly generate LaTeX citation files.
                            No PDF upload needed.
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
                        <Textarea
                            placeholder={`@article{example2024,\n  author={Author, First and Author, Second},\n  title={Your Paper Title},\n  journal={Journal Name},\n  year={2024}\n}`}
                            rows={8}
                            value={bibtexInput}
                            onChange={(e) => {
                                setBibtexInput(e.target.value);
                                setBibtexError('');
                                setBibtexSuccess(false);
                            }}
                            className="font-mono text-sm bg-white mb-4"
                        />
                        {bibtexError && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{bibtexError}</AlertDescription>
                            </Alert>
                        )}
                        {bibtexSuccess && (
                            <Alert className="mb-4 border-green-200 bg-green-50">
                                <Check className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    LaTeX files downloaded successfully!
                                </AlertDescription>
                            </Alert>
                        )}
                        <Button
                            onClick={handleBibtexDownload}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-5 rounded-xl font-semibold shadow-lg shadow-blue-500/15 transition-all"
                        >
                            <Download size={18} className="mr-2" />
                            Download LaTeX Files
                        </Button>
                    </div>
                </div>
            </section>

            {/* Citation Section */}
            <section id="citation" className="py-16 px-6 bg-white">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                            <Quote size={22} className="text-blue-600" />
                            Cite CiteAssist
                        </h2>
                        <p className="text-gray-600">
                            If you use this tool in your research, please cite it:
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex justify-end mb-3">
                            <button
                                onClick={handleCopyClick}
                                className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium"
                                aria-label="Copy citation to clipboard"
                            >
                                {copySuccess ? (
                                    <><Check size={16} /><span>Copied!</span></>
                                ) : (
                                    <><Clipboard size={16} /><span>Copy BibTeX</span></>
                                )}
                            </button>
                        </div>
                        <pre className="bg-white p-5 rounded-xl border border-gray-100 text-sm overflow-x-auto font-mono text-gray-700 leading-relaxed">
{citationText}
                        </pre>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        Ready to streamline your citations?
                    </h2>
                    <p className="text-blue-100 mb-6 max-w-lg mx-auto text-lg">
                        Upload your PDF and get publication-ready BibTeX entries in seconds.
                    </p>
                    <Link to="/app">
                        <Button className="bg-white text-blue-700 hover:bg-blue-50 px-10 py-6 rounded-xl text-lg font-semibold shadow-xl transition-all group">
                            Start Now
                            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-6 px-6">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <span className="text-white font-semibold">CiteAssist</span>
                        <span className="mx-2">&middot;</span>
                        <span className="text-sm">University of Göttingen</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                        <a
                            href="https://github.com/gipplab/preprint_generator"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-white transition-colors"
                        >
                            <GitHubIcon fontSize="small" />
                            GitHub
                        </a>
                        <a
                            href="https://aclanthology.org/2024.sdp-1.10/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-white transition-colors"
                        >
                            <ArticleIcon fontSize="small" />
                            ACL Anthology
                        </a>
                        <Link to="/impressum" className="flex items-center gap-1.5 hover:text-white transition-colors">
                            <InfoIcon size={16} />
                            Impressum
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
