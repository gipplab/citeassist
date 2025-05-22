import {PDFFile} from "./PDFParser";
import {BibTexEntry} from "./PDFFileForm";
import React, {useState} from "react";

import {arxivid2doi, doi2bib, RelatedPaperInfo} from "../annotation/AnnotationAPI";
import {requestPreprints} from "../EnhancedPreprintGenerator";
import {Input} from '../components/ui/Input';
import {Button} from '../components/ui/Button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../components/ui/Select';
import {Label} from '../components/ui/Label';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '../components/ui/Tabs';
import {Textarea} from '../components/ui/Textarea';
import {Alert, AlertDescription, AlertTitle} from '../components/ui/Alert';
import {AlertTriangle, FileDown, Upload, Plus, X, Asterisk} from 'lucide-react';
import {RadioGroup, RadioGroupItem} from '../components/ui/RadioGroup';
import {Badge} from '../components/ui/Badge';
import "../output.css"
import {Separator} from "../components/ui/Seperator";
import {parseBibTex} from "../annotation/AnnotationParser";
import {useMediaQuery} from "react-responsive";
import {CircularProgress} from "@mui/material";

// const Transition = React.forwardRef(function Transition(
//     props: TransitionProps & {
//         children: React.ReactElement<any, any>;
//     },
//     ref: React.Ref<unknown>,
// ) {
//     return <Slide direction="up" ref={ref} {...props} />;
// });
type BibTexEntries = {
    [key: string]: BibTexEntry;
};

class RelatedPaper extends React.Component<{
    title: string,
    authors: string | undefined,
    year: string | undefined,
    onRemove: () => void
}> {
    render() {
        let {title, authors, year, onRemove} = this.props;
        return (
            <div className="flex items-center justify-between p-3 border rounded-lg mb-2">
                <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-sm text-gray-600">{authors} ({year})</p>
                </div>
                <Button variant="ghost" size="sm" onClick={onRemove}>
                    <X className="h-4 w-4"/>
                </Button>
            </div>
        );
    }
}


export function PDFInfoForm(props: {
    file: PDFFile,
    onSubmit: (bibTexEntries: {
        [id: string]: string
    }, keywords: string[], similarPreprints: RelatedPaperInfo[], latex: boolean, upload: boolean) => void
}) {
    const bibTexEntries: BibTexEntries = {
        pages: {name: "Pages", tag: "pages", default: true, value: "" + props.file.info.pages, type: "number"},
        doi: {name: "DOI", tag: "doi", default: true, value: "", type: ""},
        url: {name: "URL", tag: "url", default: true, value: "", type: ""},
        journal: {name: "Journal", tag: "journal", default: true, value: "", type: ""},
        volume: {name: "Volume", tag: "volume", default: true, value: "", type: "number"},
        number: {name: "Number", tag: "number", default: true, value: "", type: "number"},
        publisher: {name: "Publisher", tag: "publisher", default: true, value: "", type: ""},
        address: {name: "Address", tag: "address", default: true, value: "", type: ""},
        howpublished: {name: "howpublished", tag: "howpublished", default: true, value: "", type: ""},
        booktitle: {name: "Booktitle", tag: "booktitle", default: true, value: "", type: ""},
        editor: {name: "Editor", tag: "editor", default: true, value: "", type: ""},
        series: {name: "Series", tag: "series", default: true, value: "", type: ""},
        organization: {name: "Organization", tag: "organization", default: true, value: "", type: ""},
        school: {name: "School", tag: "school", default: true, value: "", type: ""},
        note: {name: "Note", tag: "note", default: true, value: "", type: ""},
        institution: {name: "Institution", tag: "institution", default: true, value: "", type: ""},
        confacronym: {name: "confacronym", tag: "confacronym", default: false, value: "", type: ""},
    }
    const artTypeFields: { [type: string]: BibTexEntry[] } = {
        "article": [bibTexEntries.journal, bibTexEntries.volume, bibTexEntries.number, bibTexEntries.pages],
        "book": [bibTexEntries.publisher, bibTexEntries.address],
        "booklet": [bibTexEntries.howpublished],
        "inbook": [bibTexEntries.booktitle, bibTexEntries.publisher, bibTexEntries.address, bibTexEntries.pages],
        "incollection": [bibTexEntries.booktitle, bibTexEntries.publisher, bibTexEntries.address, bibTexEntries.pages],
        "inproceedings": [bibTexEntries.booktitle, bibTexEntries.series, bibTexEntries.pages, bibTexEntries.publisher, bibTexEntries.address],
        "manual": [bibTexEntries.organization, bibTexEntries.address],
        "mastersthesis": [bibTexEntries.school, bibTexEntries.address],
        "misc": [bibTexEntries.howpublished, bibTexEntries.note],
        "phdthesis": [bibTexEntries.school, bibTexEntries.address],
        "proceedings": [bibTexEntries.series, bibTexEntries.volume, bibTexEntries.publisher, bibTexEntries.address],
        "techreport": [bibTexEntries.institution, bibTexEntries.address, bibTexEntries.number],
        "unpublished": [],
    }
    const [keywords, setKeywords] = useState<string[]>(props.file!.info.keywords)
    const [similarPapers, setSimilarPapers] = useState<RelatedPaperInfo[]>([])
    const [relatedPapers, setRelatedPapers] = useState<RelatedPaperInfo[]>([])
    const [entries, setEntries] = useState<BibTexEntry[]>([]);
    const [publishDate, setPublishDate] = useState(props.file.info.date)
    const [artType, setArtType] = useState("")
    const [artRef, setArtRef] = useState(props.file.info.artTitle)
    const [artTitle, setArtTitle] = useState(props.file.info.title)
    const [artAuthor, setArtAuthor] = useState(props.file.info.author || "")
    const [artTypeError, setArtTypeError] = useState(false)
    const [artRefError, setArtRefError] = useState(false)
    const [artTitleError, setArtTitleError] = useState(false)
    const [artAuthorError, setArtAuthorError] = useState(false)

    const [activeTab, setActiveTab] = useState('basic');
    const [generationType, setGenerationType] = useState('pdf');
    const [keywordInput, setKeywordInput] = useState('');
    const [customFields, setCustomFields] = useState<{ name: string, value: string }[]>([]);
    const [newFieldName, setNewFieldName] = useState('');
    const [newFieldValue, setNewFieldValue] = useState('');
    const [suggestedFields, setSuggestedFields] = useState<string[]>([]);
    const [arxivInput, setArxivInput] = useState('');
    const [bibtexInput, setBibtexInput] = useState('');

    const [isLoadingRelatedPapers, setIsLoadingRelatedPapers] = useState(false);
    const [isLoadingArxivPaper, setIsLoadingArxivPaper] = useState(false);

    function handleSubmit(upload: boolean) {
        const bibTexEntries: { [id: string]: string } = {}
        bibTexEntries["artType"] = artType
        bibTexEntries["ref"] = artRef
        bibTexEntries["author"] = artAuthor
        bibTexEntries["title"] = artTitle
        entries.forEach((entry) => {
            bibTexEntries[entry.tag] = entry.value
        })
        bibTexEntries["year"] = "" + publishDate.getFullYear()
        bibTexEntries["month"] = "" + ('0' + (publishDate.getMonth() + 1)).slice(-2)
        let generate = true
        if (artType === "") {
            generate = false
            setArtTypeError(true)
        }
        if (artAuthor === "") {
            generate = false
            setArtAuthorError(true)
        }
        if (artTitle === "") {
            generate = false
            setArtTitleError(true)
        }
        if (artRef === "") {
            generate = false
            setArtRefError(true)
        }
        const submitBibtexEntries: { [p: string]: string } = {}
        Object.entries(bibTexEntries).forEach(entry => {
            submitBibtexEntries[entry[0]] = entry[1]
        })
        customFields.forEach(entry => {
            submitBibtexEntries[entry.name.toLowerCase()] = entry.value
        })
        if (generate) {
            props.onSubmit(submitBibtexEntries, keywords, [...relatedPapers, ...similarPapers].sort((a, b) => (a.title > b.title) ? 1 : (a.title === b.title) ? 1 : -1), generationType !== "pdf", upload)
        }
    }

    const addKeyword = () => {
        if (keywordInput.trim() !== '' && !keywords.includes(keywordInput.trim())) {
            setKeywords([...keywords, keywordInput.trim()]);
            setKeywordInput('');
        }
    };

    const removeKeyword = (keyword: string) => {
        setKeywords(keywords.filter(k => k !== keyword));
    };

    const addCustomField = () => {
        if (entries.map(entry => entry.name).indexOf(newFieldName) !== -1) {
            return
        }
        if (customFields.map(entry => entry.name).indexOf(newFieldName) !== -1) {
            return
        }
        if (newFieldName.trim() !== '' && newFieldValue.trim() !== '') {
            setCustomFields([...customFields, {name: newFieldName.trim(), value: newFieldValue.trim()}]);
            setNewFieldName('');
            setNewFieldValue('');
        }
    };

    const addSuggestedField = (fieldName: string) => {
        if (!customFields.some(field => field.name === fieldName)) {
            const extractedValue = Object.values(bibTexEntries).find(entry => entry.name === fieldName)
            if (extractedValue) {
                setCustomFields([...customFields, {name: fieldName, value: extractedValue.value}]);
            } else {
                setCustomFields([...customFields, {name: fieldName, value: ""}]);
            }
        }
    };

    const removeCustomField = (index: number) => {
        setCustomFields(customFields.filter((_, i) => i !== index));
    };

    const removeRelatedPaper = (title: string) => {
        setRelatedPapers(relatedPapers.filter(paper => paper.title !== title));
    };

    const removeSimilarPaper = (title: string) => {
        setSimilarPapers(similarPapers.filter(paper => paper.title !== title));
    };

    const loadRelatedPapers = async () => {
        setIsLoadingRelatedPapers(true);
        try {
            console.log("Loading related papers based on keywords:", keywords);
            const loadedRelatedPapers = await requestPreprints("", keywords)
            setSimilarPapers(loadedRelatedPapers || [])
        } catch (error) {
            console.error("Error loading related papers:", error);
        } finally {
            setIsLoadingRelatedPapers(false);
        }
    };

    const addRelatedPaper = async () => {
        if (!arxivInput.trim()) return;
        
        setIsLoadingArxivPaper(true);
        try {
            const doiPaper = await doi2bib(arxivInput)
            if (doiPaper !== null) {
                const newPaper = {
                    title: doiPaper.title,
                    author: doiPaper.author,
                    year: doiPaper.year,
                    url: doiPaper.url,
                    doi: doiPaper.doi
                };
                if (relatedPapers.map(paper => paper.title).indexOf(newPaper.title) !== -1) {
                    setArxivInput('');
                    return
                }
                setRelatedPapers([...relatedPapers, newPaper]);
                setArxivInput('');
                return
            }
            const arxivPaper = await arxivid2doi(arxivInput)
            if (arxivPaper !== null) {
                const newPaper = {
                    title: arxivPaper.title,
                    author: arxivPaper.author,
                    year: arxivPaper.year,
                    url: arxivPaper.url,
                    doi: arxivPaper.doi
                };
                if (relatedPapers.map(paper => paper.title).indexOf(newPaper.title) !== -1) {
                    setArxivInput('');
                    return
                }
                setRelatedPapers([...relatedPapers, newPaper]);
                setArxivInput('');
                return
            }
        } catch (error) {
            console.error("Error adding paper:", error);
        } finally {
            setIsLoadingArxivPaper(false);
        }
    };

    const RequiredBadge = () => (
        <Badge variant="secondary" className="ml-2 flex items-center space-x-1">
            <Asterisk className="h-3 w-3 text-red-500 mr-1"/> Required
        </Badge>
    );

    function isValidNumber(value: string): boolean {
        return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
    }

    // @ts-ignore
    const isMobile = useMediaQuery({maxWidth: 768});


    return <>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full  mb-4 bg-cyan-300 ${(isMobile) ? "h-44 grid-rows-5" : "grid-cols-5"}`}>
                <TabsTrigger value="basic" className="relative">
                    Basic Info
                    <RequiredBadge/>
                    {(artTypeError || artRefError || artAuthorError || artTitleError) &&
                        <AlertTriangle className="h-4 w-4 text-red-500 ml-0.5"/>}
                </TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                <TabsTrigger value="keywords-related">Keywords & Related</TabsTrigger>
                <TabsTrigger value="parse">Parse BibTeX</TabsTrigger>
                <TabsTrigger value="generate" className="relative">
                    Generate
                    <RequiredBadge/>
                </TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="type">Type</Label>
                        <Select value={artType} onValueChange={event => {
                            setEntries(artTypeFields[event])
                            setSuggestedFields(Object.values(bibTexEntries).filter(entry => {
                                return artTypeFields[event].map(e => e.tag).indexOf(entry.tag) === -1
                            }).map(entry => entry.name))
                            setArtType(event)
                            setArtTypeError(false)
                        }}>
                            <SelectTrigger className={`w-full ${artTypeError ? 'border-red-500' : ''}`}>
                                <SelectValue placeholder="Please select your article type"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="article">Journal article</SelectItem>
                                <SelectItem value="book">Book</SelectItem>
                                <SelectItem value="booklet">Printed work without a publisher</SelectItem>
                                <SelectItem value="inbook">Any section in a book</SelectItem>
                                <SelectItem value="incollection">A titled section of a book</SelectItem>
                                <SelectItem value="inproceedings">Conference paper</SelectItem>
                                <SelectItem value="manual">Manual</SelectItem>
                                <SelectItem value="mastersthesis">Master's thesis</SelectItem>
                                <SelectItem value="phdthesis">PhD thesis</SelectItem>
                                <SelectItem value="techreport">Technical report or white paper</SelectItem>
                                <SelectItem value="unpublished">A work that has not yet been officially published
                                </SelectItem>
                                <SelectItem value="misc">Miscellaneous: if nothing else fits</SelectItem>
                            </SelectContent>
                        </Select>
                        {artTypeError && (
                            <div className="flex flex-row items-center">
                                <AlertTriangle className="h-4 w-4 text-red-500"/>
                                <div className="text-red-500">Please enter a Type</div>
                            </div>

                        )}
                    </div>
                    <div>
                        <Label htmlFor="publish-date">Publish Date</Label>
                        <Input id="publish-date" type="date" value={publishDate.toISOString().split('T')[0]}
                               onChange={event => {
                                   setPublishDate(new Date(event.target.value))
                               }}/>
                    </div>
                    <div>
                        <Label htmlFor="reference">Reference</Label>
                        <Input id="reference" placeholder="Enter the Reference" value={artRef} onChange={e => {
                            setArtRef(e.target.value)
                            setArtRefError(false)
                        }}/>
                        {artRefError && (
                            <div className="flex flex-row items-center">
                                <AlertTriangle className="h-4 w-4 text-red-500"/>
                                <div className="text-red-500">Please enter a Reference</div>
                            </div>

                        )}
                    </div>
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" placeholder="Enter the Title" value={artTitle} onChange={e => {
                            setArtTitleError(false)
                            setArtTitle(e.target.value)
                        }}/>
                        {artTitleError && (
                            <div className="flex flex-row items-center">
                                <AlertTriangle className="h-4 w-4 text-red-500"/>
                                <div className="text-red-500">Please enter a Title</div>
                            </div>

                        )}
                    </div>
                    <div>
                        <Label htmlFor="authors">Authors</Label>
                        <Input id="authors" placeholder="Enter Authors (separated by comma)" value={artAuthor}
                               onChange={e => {
                                   setArtAuthorError(false)
                                   setArtAuthor(e.target.value)
                               }}/>
                        {artAuthorError && (
                            <div className="flex flex-row items-center">
                                <AlertTriangle className="h-4 w-4 text-red-500"/>
                                <div className="text-red-500">Please enter a Author</div>
                            </div>

                        )}
                    </div>
                    <Button variant="outline" onClick={() => setActiveTab('parse')} className="w-full mt-4">
                        Parse from BibTeX
                    </Button>
                </div>
                <Button onClick={() => setActiveTab('generate')} className="w-full mt-4">
                    Proceed to Generate
                </Button>
            </TabsContent>

            <TabsContent value="advanced">
                <div className="space-y-4">
                    {entries.map((entry) => {
                        return (<div>
                            <Label htmlFor={entry.tag}>{entry.name}</Label>
                            <Input id={entry.tag} placeholder={`Enter the ${entry.name}`} type={entry.type}
                                   value={entry.value} onChange={e => {
                                entry.error = false
                                console.log(isNaN(parseInt(e.target.value)))
                                setEntries(entries.map((obj) => {
                                    if (entry.type === "number" && !isValidNumber(e.target.value)) {
                                        return obj
                                    }
                                    if (obj === entry) {
                                        return {...obj, value: e.target.value}
                                    }
                                    return obj
                                }))
                            }}/>
                        </div>)
                    })}

                    {/* Custom Fields Section */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Custom Fields</h3>
                        {customFields.map((field, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                                <Input value={field.name} readOnly className="w-1/3"/>
                                <Input className="w-2/3" placeholder="Enter value" value={field.value} onChange={e => {
                                    setCustomFields(customFields.map((obj) => {
                                        if (obj.name === field.name) {
                                            return {...obj, value: e.target.value}
                                        }
                                        return obj
                                    }))
                                }}/>
                                <Button onClick={() => removeCustomField(index)} size="icon"
                                        variant="ghost">
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                        ))}
                        <div className="flex items-end space-x-2 mt-2">
                            <div className="w-1/3">
                                <Label htmlFor="new-field-name">Field Name</Label>
                                <Input
                                    id="new-field-name"
                                    value={newFieldName}
                                    onChange={(e) => setNewFieldName(e.target.value)}
                                    placeholder="e.g., DOI"
                                />
                            </div>
                            <div className="w-2/3">
                                <Label htmlFor="new-field-value">Field Value</Label>
                                <Input
                                    id="new-field-value"
                                    value={newFieldValue}
                                    onChange={(e) => setNewFieldValue(e.target.value)}
                                    placeholder="Enter value"
                                />
                            </div>
                            <Button onClick={addCustomField} size="icon">
                                <Plus className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Label>Suggested Fields</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {suggestedFields.map((field) => (
                                <Badge
                                    key={field}
                                    variant="outline"
                                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                                    onClick={() => addSuggestedField(field)}
                                >
                                    {field}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
                <Button onClick={() => setActiveTab('generate')} className="w-full mt-4">
                    Proceed to Generate
                </Button>
            </TabsContent>

            <TabsContent value="keywords-related">
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="keywords">Keywords</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {keywords.map((keyword, index) => (
                                <Badge key={index} variant="secondary" className="px-2 py-1">
                                    {keyword}
                                    <Button variant="ghost" size="sm" className="ml-1 p-0"
                                            onClick={() => removeKeyword(keyword)}>
                                        <X className="h-3 w-3"/>
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                        <div className="flex space-x-2">
                            <Input
                                id="keywords"
                                value={keywordInput}
                                onChange={(e) => setKeywordInput(e.target.value)}
                                placeholder="Enter a keyword"
                                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                            />
                            <Button onClick={addKeyword} size="icon">
                                <Plus className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Label>Related Papers</Label>
                        {relatedPapers.map(paper => (
                            <RelatedPaper
                                key={paper.title}
                                title={paper.title}
                                authors={paper.author}
                                year={paper.year}
                                onRemove={() => removeRelatedPaper(paper.title)}
                            />
                        ))}
                        {similarPapers.map(paper => (
                            <RelatedPaper
                                key={paper.title}
                                title={paper.title}
                                authors={paper.author}
                                year={paper.year}
                                onRemove={() => removeSimilarPaper(paper.title)}
                            />
                        ))}
                        <div className="mt-4 space-y-4">
                            <Button onClick={loadRelatedPapers} className="w-full" disabled={isLoadingRelatedPapers}>
                                {isLoadingRelatedPapers ? (
                                    <>
                                        <CircularProgress size={16} className="mr-2" /> 
                                        Loading Papers...
                                    </>
                                ) : (
                                    "Load Related Papers Based on Keywords"
                                )}
                            </Button>
                            <div className="flex items-center justify-center">
                                <Separator className="w-96"/>
                                <span className="px-2 text-sm text-gray-500">or</span>
                                <Separator className="w-96"/>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Paste arXiv ID or DOI here"
                                    value={arxivInput}
                                    onChange={(e) => setArxivInput(e.target.value)}
                                />
                                <Button onClick={addRelatedPaper} disabled={isLoadingArxivPaper}>
                                    {isLoadingArxivPaper ? (
                                        <>
                                            <CircularProgress size={16} className="mr-2" />
                                            Searching...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4 mr-2"/> Add Paper
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <Button onClick={() => setActiveTab('generate')} className="w-full mt-4">
                    Proceed to Generate
                </Button>
            </TabsContent>

            <TabsContent value="parse">
                <div className="space-y-4">
                    <Alert variant="default">
                        <AlertTriangle className="h-4 w-4"/>
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                            Parsing from BibTeX will overwrite any existing content in other fields. Make
                            sure you have saved any important information before proceeding.
                        </AlertDescription>
                    </Alert>
                    <div>
                        <Label htmlFor="bibtex-input">Paste BibTeX Here</Label>
                        <Textarea id="bibtex-input" placeholder="Paste your BibTeX entry here" rows={10}
                                  value={bibtexInput} onChange={e => setBibtexInput(e.target.value)}/>
                    </div>
                    <Button className="w-full" onClick={() => {
                        let newEntries = parseBibTex(bibtexInput)
                        console.log(newEntries)
                        if (!newEntries) {
                            return
                        }
                        setArtType(newEntries.find((entry) => {
                            return (entry.tag === "type" && !entry.default)
                        })?.value || "")

                        setArtTitle(newEntries.find((entry) => {
                            return (entry.tag === "title")
                        })?.value || "")

                        setArtAuthor(newEntries.find((entry) => {
                            return (entry.tag === "author")
                        })?.value || "")

                        setArtRef(newEntries.find((entry) => {
                            return (entry.tag === "ref")
                        })?.value || "")

                        const month = newEntries.find((entry) => {
                            return (entry.tag === "month")
                        })?.value || ""
                        const year = newEntries.find((entry) => {
                            return (entry.tag === "year")
                        })?.value || ""

                        newEntries = newEntries.filter((entry) => {
                            return (["type", "year", "month", "ref", "author", "title"].indexOf(entry.tag) === -1)
                        })
                        if (year) {
                            setPublishDate(new Date(`${month || "02"}/01/${year}`))
                        }

                        newEntries.map((entry) => {
                            const simEntry = Object.entries(bibTexEntries).find(([key, value]) => {
                                return entry.tag === key
                            })
                            if (simEntry) {
                                return {type: simEntry[1].type || "", ...entry}
                            } else {
                                return entry
                            }
                        })

                        setEntries(newEntries);
                    }}>Parse BibTeX</Button>
                </div>
                <Button onClick={() => setActiveTab('generate')} className="w-full mt-4">
                    Proceed to Generate
                </Button>
            </TabsContent>

            <TabsContent value="generate">
                <div className="space-y-6">
                    {(artTypeError || artRefError || artAuthorError || artTitleError) && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                There are required fields that need to be filled in. Please check the Basic Info tab.
                            </AlertDescription>
                        </Alert>
                    )}
                    <div>
                        <Label className="text-base">Select Output Format</Label>
                        <RadioGroup value={generationType} onValueChange={setGenerationType}
                                    className="flex flex-col space-y-1 mt-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="pdf" id="pdf"/>
                                <Label htmlFor="pdf">PDF</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="latex" id="latex"/>
                                <Label htmlFor="latex">LaTeX</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Button className="w-full flex items-center justify-center" onClick={() =>
                            handleSubmit(false)
                        }>
                            <FileDown className="mr-2 h-4 w-4"/> Generate {generationType.toUpperCase()}
                        </Button>
                        <Button className="w-full flex items-center justify-center" onClick={() => {
                            console.log("Submit")
                            handleSubmit(true)
                        }
                        }>
                            <Upload className="mr-2 h-4 w-4"/> Generate and
                            Upload {generationType.toUpperCase()}
                        </Button>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    </>;
}