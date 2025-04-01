import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ArrowRight, Info as InfoIcon } from 'lucide-react';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArticleIcon from "@mui/icons-material/Article";

const LandingPage = () => {
    // JSON-LD structured data for better SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "CiteAssist",
        "applicationCategory": "ResearchTool",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "CiteAssist is a system to automate the generation of BibTeX entries for preprints, streamlining the process of bibliographic annotation.",
        "creator": {
            "@type": "Organization",
            "name": "University of Göttingen"
        }
    };

    // Set up SEO metadata
    useEffect(() => {
        // Update document title
        document.title = "CiteAssist - Automated Preprint Citation and BibTeX Generation";
        
        // Set meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', 'CiteAssist helps you manage academic papers by extracting metadata, generating BibTeX entries, and finding related papers - perfect for researchers and academics.');
        
        // Set meta keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.setAttribute('name', 'keywords');
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', 'BibTeX, citation, academic papers, preprints, research tools, pdf annotation, citation management');
        
        // Set Open Graph tags
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (!ogTitle) {
            ogTitle = document.createElement('meta');
            ogTitle.setAttribute('property', 'og:title');
            document.head.appendChild(ogTitle);
        }
        ogTitle.setAttribute('content', 'CiteAssist - Automated Preprint Citation and BibTeX Generation');
        
        let ogDescription = document.querySelector('meta[property="og:description"]');
        if (!ogDescription) {
            ogDescription = document.createElement('meta');
            ogDescription.setAttribute('property', 'og:description');
            document.head.appendChild(ogDescription);
        }
        ogDescription.setAttribute('content', 'Streamline your academic paper workflow with automatic metadata extraction and BibTeX generation.');
        
        let ogType = document.querySelector('meta[property="og:type"]');
        if (!ogType) {
            ogType = document.createElement('meta');
            ogType.setAttribute('property', 'og:type');
            document.head.appendChild(ogType);
        }
        ogType.setAttribute('content', 'website');
        
        // Add JSON-LD structured data
        let script = document.querySelector('script[type="application/ld+json"]');
        if (!script) {
            script = document.createElement('script');
            script.setAttribute('type', 'application/ld+json');
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(structuredData);
        
        // Set canonical link
        let link = document.querySelector('link[rel="canonical"]');
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            document.head.appendChild(link);
        }
        link.setAttribute('href', window.location.href);
        
        // Clean up on unmount
        return () => {
            // Optional: Remove added elements on unmount if desired
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-3 px-4 font-medium shadow-md">
                This is a free non-commercial service provided by the University of Göttingen.
            </div>
            
            <div className="bg-gray-50 py-2 px-4 flex justify-center gap-4 shadow-sm">
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
            </div>
            
            <main className="flex-grow flex items-center justify-center p-4">
                <Card className="w-full max-w-3xl shadow-2xl border border-indigo-100 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-center">
                        <CardTitle className="text-4xl font-bold text-white mb-2">
                            <h1>CiteAssist</h1>
                        </CardTitle>
                        <CardDescription className="text-blue-100 text-lg">
                            Streamline your academic paper workflow
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-8">
                        <div className="space-y-6">
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                                    What CiteAssist can do for you
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    CiteAssist automates BibTeX entry generation for academic papers. It extracts metadata
                                    (authors, titles, dates, keywords), embeds citations directly in PDFs, and links them on 
                                    the first page for easy access. The system also suggests related papers based on keywords, 
                                    enhancing your research workflow through our free web interface.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                                    How to use CiteAssist
                                </h2>
                                <ul className="list-disc list-inside text-gray-600 space-y-2 leading-relaxed">
                                    <li>Upload your academic paper PDF</li>
                                    <li>CiteAssist will automatically extract metadata and generate BibTeX entries</li>
                                    <li>Browse related papers based on keywords</li>
                                    <li>Generate either LaTeX files or a new annotated PDF with embedded citations</li>

                                </ul>
                            </section>
                        </div>
                    </CardContent>
                    
                    <CardFooter className="p-8 flex justify-center border-t border-gray-100 bg-gray-50">
                        <Link to="/app">
                            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 rounded-lg text-lg flex items-center gap-2 shadow-lg transform transition-transform hover:scale-105">
                                Get Started
                                <ArrowRight size={20} />
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
};

export default LandingPage; 