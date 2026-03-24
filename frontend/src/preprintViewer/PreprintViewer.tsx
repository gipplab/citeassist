import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {useTheme, useMediaQuery} from '@mui/material';
import {ArrowLeft, Copy as CopyIcon, FileText, Check, Download, ExternalLink} from 'lucide-react';
import GitHubIcon from "@mui/icons-material/GitHub";
import { env } from '../config';

const backendURL = env.BACKEND_URL;

interface Preprint {
    title: string;
    author: string;
    year: string;
    annotation: string;
    // Add other relevant fields for your preprint
}

const PreprintViewer = () => {
    const {title} = useParams();
    const [preprint, setPreprint] = useState<Preprint | null>(null);
    const [copied, setCopied] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        fetch(`${backendURL}/preprint/info/${title}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data: Preprint) => {
                setPreprint(data);
            })
            .catch(error => {
                console.error('Error fetching preprint', error);
            });
    }, [title]);

    // For SEO
    useEffect(() => {
        if (preprint) {
            document.title = `${preprint.title} | CiteAssist Citation Viewer`;
            
            // Set meta description
            let metaDescription = document.querySelector('meta[name="description"]');
            if (!metaDescription) {
                metaDescription = document.createElement('meta');
                metaDescription.setAttribute('name', 'description');
                document.head.appendChild(metaDescription);
            }
            metaDescription.setAttribute('content', `View citation and BibTeX entry for "${preprint.title}" by ${preprint.author} (${preprint.year})`);
        }
    }, [preprint]);

    return (
        <div className="min-h-screen bg-cream flex flex-col">
            {/* Banner */}
            <div className="w-full bg-cream-dark text-gray-500 text-center py-2 px-4 text-sm border-b border-warm-border">
                A free non-commercial service by the{' '}
                <a href="https://uni-goettingen.de/" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline transition-colors">
                    University of Göttingen
                </a>
            </div>

            {/* Nav */}
            <nav className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-warm-border py-3 px-6 max-sm:px-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="font-serif text-xl font-bold text-[#1a1a2e]">CiteAssist</span>
                    </Link>
                    <div className="flex items-center gap-3">
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
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <main className="flex-grow max-w-6xl mx-auto w-full py-8 px-6 max-sm:py-6 max-sm:px-4">
                <Link to="/" className="inline-flex items-center gap-1.5 text-accent-blue hover:underline text-sm font-medium mb-6 transition-colors">
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>

                {preprint ? (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Left: Metadata & Citation */}
                        <div className="lg:col-span-2 space-y-5">
                            {/* Paper info */}
                            <div className="bg-white rounded-xl border border-warm-border p-5">
                                <h1 className="font-serif text-xl font-bold text-[#1a1a2e] mb-3 leading-snug">
                                    {preprint.title}
                                </h1>
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-start gap-2">
                                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide mt-0.5 w-14 flex-shrink-0">Author</span>
                                        <span className="text-sm text-[#1a1a2e]">{preprint.author}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide mt-0.5 w-14 flex-shrink-0">Year</span>
                                        <span className="text-sm text-[#1a1a2e]">{preprint.year}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <a
                                        href={`${backendURL}/preprint/${title}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-blue hover:bg-[#2d4373] text-white rounded-lg text-xs font-medium transition-all"
                                    >
                                        <Download size={13} />
                                        Download PDF
                                    </a>
                                    <a
                                        href={`${backendURL}/preprint/${title}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-warm-border hover:border-accent-blue text-gray-600 hover:text-accent-blue rounded-lg text-xs font-medium transition-all"
                                    >
                                        <ExternalLink size={13} />
                                        Open
                                    </a>
                                </div>
                            </div>

                            {/* Citation */}
                            <div className="bg-white rounded-xl border border-warm-border p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-sm font-semibold text-[#1a1a2e]">BibTeX Citation</h2>
                                    <button
                                        onClick={() => copyToClipboard(preprint.annotation)}
                                        className="flex items-center gap-1.5 px-2.5 py-1 bg-accent-blue-light hover:bg-accent-blue hover:text-white text-accent-blue rounded-lg transition-colors text-xs font-medium"
                                    >
                                        {copied ? (
                                            <><Check size={13} /> Copied!</>
                                        ) : (
                                            <><CopyIcon size={13} /> Copy</>
                                        )}
                                    </button>
                                </div>
                                <pre className="bg-cream p-3 rounded-lg border border-warm-border text-xs overflow-auto max-h-72 font-mono text-gray-600 leading-relaxed whitespace-pre-wrap break-all">
{preprint.annotation}
                                </pre>
                            </div>
                        </div>

                        {/* Right: PDF Preview */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-xl border border-warm-border overflow-hidden h-full flex flex-col">
                                <div className="px-5 py-3 border-b border-warm-border bg-cream-dark flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText size={15} className="text-accent-blue" />
                                        <span className="text-sm font-medium text-[#1a1a2e]">PDF Preview</span>
                                    </div>
                                </div>
                                <div className="flex-grow bg-cream">
                                    <iframe
                                        src={`${backendURL}/preprint/${title}`}
                                        width="100%"
                                        height={isMobile ? "400px" : "100%"}
                                        style={{minHeight: isMobile ? '400px' : '650px', border: 'none'}}
                                        title="PDF Viewer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
                        <FileText size={40} className="mb-3" />
                        <p className="text-base">Loading preprint information...</p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-[#1a1a2e] text-gray-500 py-4 px-6 max-sm:px-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between text-sm">
                    <div>
                        <span className="text-white font-serif font-bold">CiteAssist</span>
                        <span className="mx-2 text-gray-600">&middot;</span>
                        <span className="text-gray-500">University of Göttingen</span>
                    </div>
                    <a
                        href="https://github.com/gipplab/preprint_generator"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                        <GitHubIcon fontSize="small" />
                        GitHub
                    </a>
                </div>
            </footer>
        </div>
    );
};


export default PreprintViewer;
