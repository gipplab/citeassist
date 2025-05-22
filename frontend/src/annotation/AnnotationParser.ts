import {parse, Entry} from '@retorquere/bibtex-parser';
import {BibTexEntry} from "../pdf/PDFFileForm";


export const parseBibTex = (input: string): BibTexEntry[] | null => {
    try {
        const parsed = parse(input, {raw: true});
        console.log(parsed)
        return transformParsedData(parsed.entries);
    } catch (error) {
        console.error("Error parsing BibTeX: ", error);
        return null;
    }
};

const transformParsedData = (entries: Entry[]): BibTexEntry[] | null => {
    if (entries.length === 0) return null
    const newEntries = Object.entries(entries[0].fields).map(([key, value]) => {
        return {
            name: key,
            tag: key,
            default: true,
            value: value.join(" and "),
        };
    });
    newEntries.push({
        name: "type",
        tag: "type",
        default: false,
        value: entries[0].type
    })
    newEntries.push({
        name: "ref",
        tag: "ref",
        default: false,
        value: entries[0].key
    })
    return newEntries
}
