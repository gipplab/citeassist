import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {Container, Grid, Paper, Typography, Box, Button, useTheme, useMediaQuery} from '@mui/material';
import {ArrowLeft, Copy as CopyIcon, FileText} from 'lucide-react';
import config from "../config.json";
import '../EnhancedPreprintGenerator.css';
import {EnhancedPreprintGeneratorAppBar} from "../EnhancedPreprintGeneratorAppBar";
import {ThemeProvider} from "@mui/material/styles";
import darkTheme from "../theme";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "../components/ui/Card";
import GitHubIcon from "@mui/icons-material/GitHub"; // Assuming this CSS file has your styling

const backendURL = process.env.REACT_APP_BACKEND_URL || config.backend_url;

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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-3 px-4 font-medium shadow-md">
                This is a free non-commercial service provided by the <a href="https://uni-goettingen.de/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80 transition-colors">University of Göttingen</a>.
            </header>
            
            <main className="flex-grow container mx-auto py-8 px-4">
                <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors">
                    <ArrowLeft size={20} />
                    <span>Back to Home</span>
                </Link>

                <Card className="w-full shadow-xl border border-indigo-100 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                        <h1 className="text-3xl font-bold text-white">
                            <Link to="/" className="hover:text-blue-100 transition-colors">CiteAssist</Link> | Preprint Viewer
                        </h1>
                    </CardHeader>
                    
                    {preprint ? (
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{preprint.title}</h2>
                                        <div className="space-y-2">
                                            <p className="text-gray-700">
                                                <span className="font-medium">Author:</span> {preprint.author}
                                            </p>
                                            <p className="text-gray-700">
                                                <span className="font-medium">Year:</span> {preprint.year}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-semibold text-gray-800">Citation</h3>
                                            <Button 
                                                onClick={() => copyToClipboard(preprint.annotation)}
                                                variant="outlined"
                                                size="small"
                                                className={`transition-colors ${copied ? 'bg-green-50 text-green-700 border-green-200' : ''}`}
                                            >
                                                <CopyIcon size={16} className="mr-2" />
                                                {copied ? 'Copied!' : 'Copy Citation'}
                                            </Button>
                                        </div>
                                        <div className="bg-gray-50 rounded p-4 font-mono text-sm overflow-auto max-h-80 border border-gray-200">
                                            <pre className="whitespace-pre-wrap break-all">{preprint.annotation}</pre>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 flex flex-col h-full">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">PDF Preview</h3>
                                    <div className="flex-grow bg-gray-100 rounded border border-gray-300 overflow-hidden">
                                        <iframe
                                            src={`${backendURL}/preprint/${title}`}
                                            width="100%"
                                            height={isMobile ? "300px" : "600px"}
                                            style={{minHeight: '500px', border: 'none'}}
                                            title="PDF Viewer"
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    ) : (
                        <CardContent className="p-6 flex justify-center items-center min-h-[400px]">
                            <div className="flex flex-col items-center text-gray-500">
                                <FileText size={48} className="mb-4 text-gray-400" />
                                <p className="text-xl">Loading preprint information...</p>
                            </div>
                        </CardContent>
                    )}
                    
                    <CardFooter className="bg-gray-50 p-4 border-t border-gray-200">
                        <div className="w-full flex justify-between items-center text-sm text-gray-600">
                            <span>© 2024 GippLab</span>
                            <a
                                href="https://github.com/gipplab/preprint_generator"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
                            >
                                <GitHubIcon fontSize="small" />
                                View on GitHub
                            </a>
                        </div>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
};
{/*<ThemeProvider theme={darkTheme}>
            <Box className="App">
                <EnhancedPreprintGeneratorAppBar file={undefined} apiConnected={true} onClick={undefined}/>
                <header className={"App-header"} style={{justifyContent: "center"}}>
                    <Container maxWidth="lg">

                    </Container>
                </header>
            </Box>
        </ThemeProvider>*/
}


export default PreprintViewer;
