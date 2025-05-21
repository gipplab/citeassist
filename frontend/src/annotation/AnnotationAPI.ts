// Inspired by: https://github.com/davidagraf/doi2bib2/blob/master/server/doi2bib.js

export interface RelatedPaperInfo {
    title: string,
    author?: string,
    url?: string,
    doi?: string,
    year?: string

}

export function relatedPaperToString(paper: RelatedPaperInfo) {
    let result = ""
    // Only add first author. They are separated by commas. if there are multiple add "et al."
    let authors = paper.author?.split(",")
    if (authors && authors.length > 1) {
        result += authors[0] + " et al. "
    } else if (authors && authors.length == 1) {
        result += authors[0] + ". "
    } else {
        result += "Unknown author. "
    }
    if (paper.url) {
        result += String.raw`\href{${paper.url}}{${paper.title}}` + ". "
    }else {
        result += paper.title + ". "
    }
    if (paper.doi) {
        result += paper.doi + ". "
    }
    if (paper.year) {
        result += paper.year + ". "
    }
    return result
}

function doi2bibOptions(doi: string) {
    return {
        url: 'https://doi.org/' + doi,
        headers: {
            'Accept': 'application/x-bibtex; charset=utf-8'
        }
    };
}

export async function doi2bib(doi_id: string): Promise<RelatedPaperInfo | null> {
    console.log(doi_id)
    const doiOptions = doi2bibOptions(doi_id)
    let text: string
    try {
        const res = await fetch(doiOptions.url, {headers: doiOptions.headers});
        console.log(res);

        // Check if the response was redirected
        if (res.redirected) {
            const redirectedRes = await fetch(res.url, {headers: doiOptions.headers});
            text = await redirectedRes.text();
        } else {
            text = await res.text();
        }
        console.log(text);  // Log the BibTeX entry
    } catch (error) {
        console.error('Error fetching BibTeX:', error);
        return null;
    }
    const titleMatch = text.match(/title\s*=\s*{([^}]+)}/);
    const authorMatch = text.match(/author\s*=\s*{([^}]+)}/);
    const urlMatch = text.match(/url\s*=\s*{([^}]+)}/);
    const doiMatch = text.match(/doi\s*=\s*{([^}]+)}/);
    const yearMatch = text.match(/year\s*=\s*{([^}]+)}/);

    if (!titleMatch) {
        console.error('Error fetching BibTeX: Title not found');
        return null;
    }

    const title = titleMatch[1];
    const author = authorMatch ? authorMatch[1] : undefined;
    const url = urlMatch ? urlMatch[1] : undefined;
    const doi = doiMatch ? doiMatch[1] : undefined;
    const year = yearMatch ? yearMatch[1] : undefined;

    return { title, author, url, doi, year };
}

function arxivid2doiOptions(arxivid: string) {
    const options = {
        url: 'https://export.arxiv.org/api/query?id_list=' + arxivid
    };
    return options;
}


export async function arxivid2doi(arxivid: string): Promise<RelatedPaperInfo | null> {
    const arxivOptions = arxivid2doiOptions(arxivid)
    let text: string
    try {
        const res = await fetch(arxivOptions.url)
        text = await res.text()
    } catch (_) {
        return null
    }
    const titleRes = text.match(/<title>(.+)<\/title>/s)
    const authorRes = text.match(/<name>(.+)<\/name>/g)
    const urlRes = text.match(/<link href="(.+)" rel="alternate"/)
    const yearRes = text.match(/<published>(.+)<\/published>/)
    const title = (titleRes) ? (((titleRes.length > 1) ? titleRes[1].replaceAll("\n", "").trim() : "Error")) : "Error"
    if (title == "Error") {
        return null
    }
    const author = (authorRes) ? (((authorRes.length > 1) ? authorRes.map(author => author.split("<name>")[1].split("</name>")[0]).join(", ") : undefined)) : undefined
    const url = (urlRes) ? (((urlRes.length > 1) ? urlRes[1] : undefined)) : undefined
    const year = (yearRes) ? (((yearRes.length > 1) ? (new Date(yearRes[1])).getFullYear().toString() : undefined)) : undefined
    return {author: author, title: title, url: url, year: year}
}