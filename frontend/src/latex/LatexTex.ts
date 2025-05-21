export function generateLatexTex(annotation: string, link: string, relatedPapers: string[]) {
    // Create related papers items
    let relatedPapersSection = '';
    if (relatedPapers && relatedPapers.length > 0) {
        relatedPapersSection = String.raw`
% --------------  Related papers  ---------------
\vspace{0.8em}
\begin{tcolorbox}[enhanced,
                 frame hidden,
                 boxrule=0pt,
                 borderline west={2pt}{0pt}{RoyalBlue!70!black},
                 colback=RoyalBlue!3!white,
                 sharp corners,
                 breakable,
                 fonttitle=\sffamily\bfseries\large,
                 coltitle=RoyalBlue!70!black,
                 title=Related Papers,
                 attach title to upper={\vspace{0.2em}\par},
                 left=12pt]
\begin{itemize}\itemsep 2pt
${relatedPapers.map((rel) => String.raw`  \item ${rel}`).join("\n")}
\end{itemize}
\end{tcolorbox}`;
    }

    // Format online version section if needed
    const onlineVersionSection = link ? String.raw`
% ------------- Online version link -------------
\vspace{0.8em}
\begin{tcolorbox}[enhanced,
                 frame hidden,
                 boxrule=0pt,
                 borderline west={2pt}{0pt}{ForestGreen!70!black},
                 colback=ForestGreen!3!white,
                 sharp corners,
                 breakable,
                 fonttitle=\sffamily\bfseries\large,
                 coltitle=ForestGreen!70!black,
                 title=Online Version,
                 attach title to upper={\vspace{0.2em}\par},
                 left=12pt]
\href{${link}}{\color{ForestGreen!80!black}\url{${link}}}
\end{tcolorbox}
` : '';

    return String.raw`% --------- Stylish header with gold accent ---------
\definecolor{Goldenrod}{RGB}{218,165,32}
\definecolor{RoyalBlue}{RGB}{65,105,225}
\definecolor{ForestGreen}{RGB}{34,139,34}
\begin{tikzpicture}[remember picture, overlay]
  \fill[Goldenrod!80] ([xshift=0cm,yshift=0cm]current page.north west) rectangle ([xshift=0.4cm,yshift=-3cm]current page.north west);
\end{tikzpicture}

\begin{center}
  {\fontsize{22}{26}\selectfont\sffamily\bfseries \textcolor{Goldenrod!80!black}{CiteAssist}}\\[0.2em]
  {\Large\sffamily\scshape \textcolor{black!80}{Citation Sheet}}\\[0.8em]
  {\small\sffamily Generated with \href{https://citeassist.uni-goettingen.de/}{\textcolor{Goldenrod!90!black}{\texttt{citeassist.uni-goettingen.de}}}}
\end{center}

\vspace{0.5em}
\begin{tikzpicture}
\draw[Goldenrod!60, line width=0.6pt] (0,0) -- (\textwidth,0);
\end{tikzpicture}
\vspace{1.2em}

% --------------  BibTeX block  -----------------
\begin{tcolorbox}[enhanced,
                 frame hidden,
                 boxrule=0pt,
                 borderline west={2pt}{0pt}{Goldenrod!80!black},
                 colback=Goldenrod!2!white,
                 sharp corners,
                 breakable,
                 fonttitle=\sffamily\bfseries\large,
                 coltitle=Goldenrod!80!black,
                 title=BibTeX Entry,
                 attach title to upper={\vspace{0.2em}\par},
                 left=12pt]
{\footnotesize\ttfamily
\begin{verbatim}
${annotation}
\end{verbatim}
}
\end{tcolorbox}

${onlineVersionSection}
${relatedPapersSection}

% ------ Footer with subtle design element ------
\vfill
\begin{tikzpicture}
\draw[Goldenrod!40, line width=0.4pt] (0,0) -- (\textwidth,0);
\end{tikzpicture}
\begin{center}
\small\sffamily\textcolor{black!60}{Generated \today}
\end{center}`;
}