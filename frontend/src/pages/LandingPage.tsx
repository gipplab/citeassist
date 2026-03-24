import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import { Alert, AlertDescription } from "../components/ui/Alert";
import {
    ArrowRight, Info as InfoIcon, FileText, Book, Users, Clipboard, Check,
    Upload, Download, Search, Zap, AlertTriangle, Sparkles, Calendar
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

    const features = [
        {
            number: "01",
            icon: FileText,
            title: "BibTeX Generation",
            description: "Automatically extract metadata and generate properly formatted BibTeX entries from your PDF papers."
        },
        {
            number: "02",
            icon: Book,
            title: "PDF Annotation",
            description: "Embed citation information directly into your PDFs with a clickable link on the first page."
        },
        {
            number: "03",
            icon: Users,
            title: "Related Papers",
            description: "Discover relevant research based on keywords and build a network of related work."
        },
    ];

    const steps = [
        { number: "1", icon: Upload, title: "Upload PDF", description: "Drag & drop your academic paper" },
        { number: "2", icon: Zap, title: "Auto-Extract", description: "Metadata is extracted automatically" },
        { number: "3", icon: Search, title: "Find Related", description: "Discover related research papers" },
        { number: "4", icon: Download, title: "Generate Output", description: "Get annotated PDF or LaTeX files" },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-cream">
            {/* Top Banner */}
            <div className="w-full bg-cream-dark text-gray-500 text-center py-2 px-4 text-sm border-b border-warm-border">
                A free non-commercial service by the{' '}
                <a href="https://uni-goettingen.de/" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline transition-colors">
                    University of Göttingen
                </a>
            </div>

            {/* Navigation */}
            <nav className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-warm-border py-3 px-6 max-sm:px-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="font-serif text-xl font-bold text-[#1a1a2e]">CiteAssist</span>
                    </Link>
                    <div className="flex items-center gap-5 max-sm:gap-3">
                        <a href="#features" className="text-gray-500 hover:text-[#1a1a2e] transition-colors text-sm max-sm:!hidden">Features</a>
                        <a href="#how-it-works" className="text-gray-500 hover:text-[#1a1a2e] transition-colors text-sm max-sm:!hidden">How It Works</a>
                        <a href="#paper" className="text-gray-500 hover:text-[#1a1a2e] transition-colors text-sm max-sm:!hidden">Cite</a>
                        <a
                            href="https://aclanthology.org/2024.sdp-1.10/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-500 hover:text-[#1a1a2e] transition-colors max-sm:!hidden border border-warm-border rounded-full px-3 py-1 hover:border-accent-blue"
                        >
                            Paper
                        </a>
                        <a
                            href="https://github.com/gipplab/preprint_generator"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#1a1a2e] transition-colors"
                            aria-label="GitHub"
                        >
                            <GitHubIcon fontSize="small" />
                        </a>
                        <Link
                            to="/app"
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-accent-blue text-accent-blue text-sm font-medium rounded-full hover:bg-accent-blue hover:text-white transition-all"
                        >
                            Open App
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative">
                <div className="max-w-6xl mx-auto px-6 pt-12 pb-14 max-sm:px-5 max-sm:pt-8 max-sm:pb-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                        {/* Left: Text */}
                        <div>
                            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a2e] mb-4 leading-[1.1] tracking-tight">
                                Automated BibTeX
                                <br />
                                <span className="font-serif italic text-accent-blue">
                                    Generation
                                </span>
                            </h1>
                            <p className="text-base md:text-lg text-gray-500 max-w-xl mb-6 leading-relaxed">
                                The professional way to generate citations for academic papers.
                                Upload your PDF and get BibTeX entries in minutes.
                            </p>
                            <div className="flex flex-col sm:flex-row items-start gap-3">
                                <Link to="/app">
                                    <Button className="bg-accent-blue hover:bg-[#2d4373] text-white px-6 py-5 rounded-lg text-sm font-medium transition-all group">
                                        Get Started
                                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <a href="#paper">
                                    <Button variant="outline" className="px-6 py-5 rounded-lg text-sm font-medium border-warm-border hover:border-accent-blue hover:text-accent-blue transition-all">
                                        <ArticleIcon fontSize="small" className="mr-1.5" />
                                        Read the Paper
                                    </Button>
                                </a>
                            </div>
                            <p className="mt-4 text-xs text-gray-400">
                                No registration required &middot; Free for academic use
                            </p>
                        </div>

                        {/* Right: Quick LaTeX Tool */}
                        <div className="max-lg:!hidden">
                            <div className="bg-white rounded-xl border border-warm-border shadow-sm overflow-hidden">
                                {/* Header with visual flow: BibTeX → LaTeX */}
                                <div className="px-5 py-3.5 border-b border-warm-border bg-cream-dark">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            <span className="text-sm font-medium text-[#1a1a2e]">BibTeX to LaTeX</span>
                                        </div>
                                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Try it now</span>
                                    </div>
                                </div>

                                <div className="p-5 space-y-3">
                                    {/* Step 1: Input */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent-blue text-white text-[10px] font-bold">1</span>
                                            <span className="text-xs font-medium text-[#1a1a2e]">Paste your BibTeX entry</span>
                                        </div>
                                        <Textarea
                                            placeholder={`@article{example2024,\n  author={Author, First},\n  title={Your Paper Title},\n  journal={Journal Name},\n  year={2024}\n}`}
                                            rows={6}
                                            value={bibtexInput}
                                            onChange={(e) => {
                                                setBibtexInput(e.target.value);
                                                setBibtexError('');
                                                setBibtexSuccess(false);
                                            }}
                                            className="font-mono text-xs bg-cream"
                                        />
                                    </div>

                                    {bibtexError && (
                                        <Alert variant="destructive">
                                            <AlertTriangle className="h-3 w-3" />
                                            <AlertDescription className="text-xs">{bibtexError}</AlertDescription>
                                        </Alert>
                                    )}
                                    {bibtexSuccess && (
                                        <Alert className="border-green-200 bg-green-50">
                                            <Check className="h-3 w-3 text-green-600" />
                                            <AlertDescription className="text-xs text-green-800">
                                                LaTeX files downloaded!
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Step 2: Download */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent-blue text-white text-[10px] font-bold">2</span>
                                            <span className="text-xs font-medium text-[#1a1a2e]">Download LaTeX citation files</span>
                                        </div>
                                        <Button
                                            onClick={handleBibtexDownload}
                                            className="w-full bg-accent-blue hover:bg-[#2d4373] text-white py-3.5 rounded-lg text-sm font-medium transition-all"
                                        >
                                            <Download size={14} className="mr-2" />
                                            Generate &amp; Download
                                        </Button>
                                    </div>

                                    {/* Output description */}
                                    <div className="flex items-start gap-2 pt-1 border-t border-warm-border">
                                        <FileText size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-[11px] text-gray-400 leading-relaxed">
                                            Downloads a .zip with <span className="text-gray-600 font-medium">.bib</span>, <span className="text-gray-600 font-medium">.tex</span>, and citation command files ready for your LaTeX project.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-10 px-6 max-sm:py-8 max-sm:px-5 border-t border-warm-border">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`py-6 px-5 ${index < features.length - 1 ? 'md:border-r border-b md:border-b-0 border-warm-border' : ''}`}
                            >
                                <span className="text-accent-blue font-serif text-base mb-2 block">{feature.number}</span>
                                <h3 className="text-lg font-semibold text-[#1a1a2e] mb-1.5">{feature.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section id="how-it-works" className="py-12 px-6 max-sm:py-8 max-sm:px-5 bg-cream-dark border-t border-warm-border">
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-8 max-sm:mb-6 text-center">
                        How it works
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {steps.map((step, index) => (
                            <div key={index} className="text-center">
                                <div className="w-9 h-9 rounded-full border-2 border-accent-blue text-accent-blue flex items-center justify-center text-sm font-semibold mx-auto mb-3">
                                    {step.number}
                                </div>
                                <p className="text-sm font-semibold text-[#1a1a2e] mb-0.5">{step.title}</p>
                                <p className="text-xs text-gray-500">{step.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-warm-border">
                            <div className="w-8 h-8 rounded-lg bg-accent-blue-light flex items-center justify-center flex-shrink-0">
                                <Upload size={16} className="text-accent-blue" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[#1a1a2e]">Upload &amp; Host</p>
                                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                                    Get a shareable{' '}
                                    <a href="https://citeassist.uni-goettingen.de/preprint/455b4527-da96-4c79-a434-18bc65646d3b"
                                       target="_blank" rel="noopener noreferrer"
                                       className="text-accent-blue hover:underline">webpage</a>{' '}
                                    with your annotated PDF.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-warm-border">
                            <div className="w-8 h-8 rounded-lg bg-accent-blue-light flex items-center justify-center flex-shrink-0">
                                <Download size={16} className="text-accent-blue" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[#1a1a2e]">Download Only</p>
                                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                                    Download annotated PDF or LaTeX files locally. No data leaves your browser.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-5">
                        <a
                            href="https://citeassist.uni-goettingen.de/preprint/455b4527-da96-4c79-a434-18bc65646d3b"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-accent-blue hover:underline text-sm font-medium transition-colors"
                        >
                            View an example result
                            <ArrowRight size={13} />
                        </a>
                    </div>
                </div>
            </section>

            {/* BibTeX Quick Generate — mobile only (desktop uses hero card) */}
            <section id="bibtex-tool" className="lg:!hidden py-12 px-6 max-sm:py-8 max-sm:px-5 border-t border-warm-border">
                <div className="max-w-lg mx-auto">
                    <div className="bg-white rounded-xl border border-warm-border overflow-hidden">
                        <div className="px-5 py-3 border-b border-warm-border bg-cream-dark">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-sm font-medium text-[#1a1a2e]">BibTeX to LaTeX</span>
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent-blue text-white text-[10px] font-bold">1</span>
                                    <span className="text-xs font-medium text-[#1a1a2e]">Paste your BibTeX entry</span>
                                </div>
                                <Textarea
                                    placeholder={`@article{example2024,\n  author={Author, First},\n  title={Your Paper Title},\n  journal={Journal Name},\n  year={2024}\n}`}
                                    rows={6}
                                    value={bibtexInput}
                                    onChange={(e) => {
                                        setBibtexInput(e.target.value);
                                        setBibtexError('');
                                        setBibtexSuccess(false);
                                    }}
                                    className="font-mono text-sm bg-cream"
                                />
                            </div>
                            {bibtexError && (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>{bibtexError}</AlertDescription>
                                </Alert>
                            )}
                            {bibtexSuccess && (
                                <Alert className="border-green-200 bg-green-50">
                                    <Check className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800">
                                        LaTeX files downloaded!
                                    </AlertDescription>
                                </Alert>
                            )}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent-blue text-white text-[10px] font-bold">2</span>
                                    <span className="text-xs font-medium text-[#1a1a2e]">Download LaTeX citation files</span>
                                </div>
                                <Button
                                    onClick={handleBibtexDownload}
                                    className="w-full bg-accent-blue hover:bg-[#2d4373] text-white py-4 rounded-lg font-medium transition-all"
                                >
                                    <Download size={16} className="mr-2" />
                                    Generate &amp; Download
                                </Button>
                            </div>
                            <div className="flex items-start gap-2 pt-2 border-t border-warm-border">
                                <FileText size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                <p className="text-[11px] text-gray-400 leading-relaxed">
                                    Downloads a .zip with <span className="text-gray-600 font-medium">.bib</span>, <span className="text-gray-600 font-medium">.tex</span>, and citation command files ready for your LaTeX project.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Example Output Showcase */}
            <section className="py-12 px-6 max-sm:py-8 max-sm:px-5 border-t border-warm-border">
                <div className="max-w-5xl mx-auto">
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-2 text-center">
                        See the <span className="italic text-accent-blue">Result</span>
                    </h2>
                    <p className="text-gray-500 text-sm text-center mb-8 max-w-lg mx-auto">
                        CiteAssist annotates your PDF with a clickable citation button and appends a full citation sheet.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                        {/* Annotated PDF mockup */}
                        <div className="flex flex-col">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Annotated First Page</p>
                            <div className="bg-white rounded-xl border border-warm-border shadow-sm overflow-hidden flex-1 flex flex-col">
                                <div className="relative p-6 pb-8 flex-1">
                                    {/* Citation button overlay */}
                                    <div className="absolute top-4 right-0">
                                        <img src="/citation_button.png" alt="Click for Citation & BibTeX" className="w-36 max-sm:w-28" />
                                    </div>
                                    {/* Paper content mockup */}
                                    <div className="mt-10 text-center">
                                        <h4 className="text-base font-bold text-[#1a1a2e] mb-2 leading-snug">
                                            CiteAssist: A System for Automated Preprint Citation and BibTeX Generation
                                        </h4>
                                        <p className="text-xs text-gray-500 mb-1">
                                            Lars Benedikt Kaesberg &middot; Terry Ruas &middot; Jan Philip Wahle &middot; Bela Gipp
                                        </p>
                                        <p className="text-[10px] text-gray-400 italic mb-4">Georg-August University / Göttingen</p>
                                    </div>
                                    <div className="text-xs font-semibold text-[#1a1a2e] text-center mb-2">Abstract</div>
                                    <div className="space-y-1.5">
                                        <div className="h-1.5 bg-gray-100 rounded-full w-full" />
                                        <div className="h-1.5 bg-gray-100 rounded-full w-full" />
                                        <div className="h-1.5 bg-gray-100 rounded-full w-[95%]" />
                                        <div className="h-1.5 bg-gray-100 rounded-full w-full" />
                                        <div className="h-1.5 bg-gray-100 rounded-full w-[88%]" />
                                        <div className="h-1.5 bg-gray-100 rounded-full w-full" />
                                        <div className="h-1.5 bg-gray-100 rounded-full w-[72%]" />
                                        <div className="h-1.5 bg-gray-100 rounded-full w-full" />
                                        <div className="h-1.5 bg-gray-100 rounded-full w-[91%]" />
                                        <div className="h-1.5 bg-gray-100 rounded-full w-full" />
                                        <div className="h-1.5 bg-gray-100 rounded-full w-[65%]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Citation Sheet mockup */}
                        <div className="flex flex-col">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Appended Citation Sheet</p>
                            <div className="bg-white rounded-xl border border-warm-border shadow-sm overflow-hidden flex-1 flex flex-col">
                                <div className="p-6 pb-8 flex-1">
                                    <div className="text-center mb-4">
                                        <p className="font-serif text-base font-bold text-accent-blue">CiteAssist</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Citation Sheet</p>
                                    </div>
                                    <hr className="border-warm-border mb-4" />

                                    {/* BibTeX Entry */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <div className="w-0.5 h-4 bg-accent-blue rounded-full" />
                                            <p className="text-xs font-semibold text-[#1a1a2e]">BibTeX Entry</p>
                                        </div>
                                        <pre className="bg-cream p-2.5 rounded-lg border border-warm-border text-[9px] font-mono text-gray-500 leading-relaxed overflow-hidden">
{`@inproceedings{kaesberg-etal-2024,
  author={Kaesberg, Lars and ...},
  title={CiteAssist: A System...},
  booktitle={Proc. SDP 2024},
  year={2024}
}`}
                                        </pre>
                                    </div>

                                    {/* Online Access */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <div className="w-0.5 h-4 bg-accent-blue rounded-full" />
                                            <p className="text-xs font-semibold text-[#1a1a2e]">Online Access</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-[10px]">
                                                <span className="text-gray-400 w-20 flex-shrink-0">Official</span>
                                                <span className="text-accent-blue underline truncate">aclanthology.org/2024.sdp-1.10/</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px]">
                                                <span className="text-gray-400 w-20 flex-shrink-0">CiteAssist</span>
                                                <span className="text-accent-blue underline truncate">citeassist.uni-goettingen.de/...</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Related Papers */}
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <div className="w-0.5 h-4 bg-accent-blue rounded-full" />
                                            <p className="text-xs font-semibold text-[#1a1a2e]">Related Papers</p>
                                        </div>
                                        <p className="text-[10px] text-gray-500">
                                            &bull; Behera et al. <span className="italic">Visual Exploration of Literature Using Connected Papers.</span> 2023.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-6">
                        <a
                            href="https://citeassist.uni-goettingen.de/preprint/455b4527-da96-4c79-a434-18bc65646d3b"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-accent-blue hover:underline text-sm font-medium transition-colors"
                        >
                            View a live example
                            <ArrowRight size={13} />
                        </a>
                    </div>
                </div>
            </section>

            {/* Paper Section */}
            <section id="paper" className="py-12 px-6 max-sm:py-8 max-sm:px-5 border-t border-warm-border">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-6 text-center">
                        The Paper
                    </h2>
                    <div className="bg-white rounded-xl border border-warm-border p-6 max-sm:p-5">
                        <div className="flex items-start gap-4 max-sm:flex-col">
                            <div className="w-10 h-10 rounded-lg bg-accent-blue-light flex items-center justify-center flex-shrink-0 max-sm:hidden">
                                <ArticleIcon className="text-accent-blue" fontSize="small" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-serif text-lg font-semibold text-[#1a1a2e] mb-1.5 leading-snug">
                                    CiteAssist: A System for Automated Preprint Citation and BibTeX Generation
                                </h3>
                                <p className="text-sm text-gray-500 mb-3">
                                    Lars Kaesberg, Terry Ruas, Jan Philip Wahle, Bela Gipp
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-blue-light text-accent-blue">
                                        SDP 2024
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cream-dark text-gray-600 border border-warm-border">
                                        ACL Anthology
                                    </span>
                                    <span className="text-xs text-gray-400">pp. 105–119</span>
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                                    We present CiteAssist, a tool that automatically generates BibTeX entries and citation annotations for academic preprints. The system extracts metadata from PDFs and creates properly formatted citation files ready for LaTeX projects.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <a
                                        href="https://aclanthology.org/2024.sdp-1.10/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent-blue hover:bg-[#2d4373] text-white rounded-lg text-sm font-medium transition-all"
                                    >
                                        <ArticleIcon fontSize="small" />
                                        Read on ACL Anthology
                                    </a>
                                    <a
                                        href="https://aclanthology.org/2024.sdp-1.10.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-warm-border hover:border-accent-blue text-gray-600 hover:text-accent-blue rounded-lg text-sm font-medium transition-all"
                                    >
                                        <Download size={14} />
                                        PDF
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Citation Section */}
            <section id="citation" className="py-10 px-6 max-sm:py-8 max-sm:px-5 bg-cream-dark border-t border-warm-border">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-4 max-sm:flex-col max-sm:items-start max-sm:gap-2">
                        <div>
                            <h2 className="font-serif text-xl md:text-2xl font-bold text-[#1a1a2e]">
                                Cite CiteAssist
                            </h2>
                            <p className="text-gray-500 text-sm mt-0.5">
                                If you use this tool in your research, please cite it:
                            </p>
                        </div>
                        <button
                            onClick={handleCopyClick}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-blue-light hover:bg-accent-blue hover:text-white text-accent-blue rounded-lg transition-colors text-xs font-medium"
                            aria-label="Copy citation to clipboard"
                        >
                            {copySuccess ? (
                                <><Check size={14} /><span>Copied!</span></>
                            ) : (
                                <><Clipboard size={14} /><span>Copy BibTeX</span></>
                            )}
                        </button>
                    </div>
                    <pre className="bg-white p-4 max-sm:p-3 rounded-xl border border-warm-border text-xs overflow-x-auto font-mono text-gray-600 leading-relaxed">
{citationText}
                    </pre>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-14 px-6 max-sm:py-10 max-sm:px-5 bg-[#1a1a2e] text-white">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">
                        Ready to streamline your citations?
                    </h2>
                    <p className="text-gray-400 mb-6 max-w-lg mx-auto text-base">
                        Upload your PDF and get publication-ready BibTeX entries in seconds.
                    </p>
                    <Link to="/app" className="inline-block">
                        <Button className="bg-white text-[#1a1a2e] hover:bg-cream px-8 py-5 rounded-lg text-base font-medium transition-all group">
                            Start Now
                            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#1a1a2e] text-gray-500 py-6 px-6 max-sm:px-5 border-t border-gray-800">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                        <span className="text-white font-serif font-bold">CiteAssist</span>
                        <span className="mx-2 text-gray-600">&middot;</span>
                        <span className="text-sm text-gray-500">University of Göttingen</span>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-5 max-sm:flex-col max-sm:gap-2 text-sm">
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
                        <a
                            href="https://ai-cards.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-white transition-colors"
                        >
                            <Sparkles size={14} />
                            AI Usage Cards
                        </a>
                        <a
                            href="https://www.conferencedeadlines.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-white transition-colors"
                        >
                            <Calendar size={14} />
                            Conference Deadlines
                        </a>
                        <Link to="/impressum" className="flex items-center gap-1.5 hover:text-white transition-colors">
                            <InfoIcon size={14} />
                            Impressum
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
