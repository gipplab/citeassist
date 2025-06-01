export function generateLatexTex(annotation: string, link: string | undefined, citeAssistLink: string | undefined, relatedPapers: string[]) {
    // Create related papers items
    let relatedPapersSection = '';
    if (relatedPapers && relatedPapers.length > 0) {
        relatedPapersSection = String.raw`
% --------------  Related papers  ---------------
\vspace{0.8em}
\begin{tcolorbox}[enhanced,
                 frame hidden,
                 boxrule=0pt,
                 borderline west={2pt}{0pt}{Primary},
                 colback=LightBg,
                 sharp corners,
                 breakable,
                 fonttitle=\sffamily\bfseries\large,
                 coltitle=Primary,
                 title=Related Papers,
                 attach title to upper={\vspace{0.2em}\par},
                 left=12pt]
\begin{itemize}\itemsep 2pt
${relatedPapers.map((rel) => String.raw`  \item ${rel}`).join("\n")}
\end{itemize}
\end{tcolorbox}`;
    }

    // Format online version section if needed
    const onlineVersionSection = (link || citeAssistLink) ? String.raw`
% ------------- Online version link -------------
\vspace{0.8em}
\begin{tcolorbox}[enhanced,
                 frame hidden,
                 boxrule=0pt,
                 borderline west={2pt}{0pt}{Primary},
                 colback=LightBg,
                 sharp corners,
                 breakable,
                 fonttitle=\sffamily\bfseries\large,
                 coltitle=Primary,
                 title=Online Access,
                 attach title to upper={\vspace{0.2em}\par},
                 left=12pt]

% Two-column table for links
\renewcommand{\arraystretch}{1.5}
\begin{tabular}{@{}p{0.25\textwidth}@{}p{0.75\textwidth}@{}}
${link ? String.raw`\textbf{\sffamily Official Publication} & 
\begin{minipage}[t]{0.72\textwidth}
\href{${link}}{\color{Primary}\url{${link}}}
\end{minipage}\\` : ''}
${(link && citeAssistLink) ? String.raw`` : ''}
${citeAssistLink ? String.raw`\textbf{\sffamily CiteAssist} & 
\begin{minipage}[t]{0.72\textwidth}
\href{${citeAssistLink}}{\color{Primary}${citeAssistLink}}
\end{minipage}\\` : ''}
\end{tabular}

\end{tcolorbox}
` : '';

    return String.raw`% --------- Required packages for formatting ---------
\lstset{
  basicstyle=\footnotesize\ttfamily,
  breaklines=true,
  breakatwhitespace=false,
  columns=flexible,
  numbers=none
}

% --------- Define simplified color palette ---------
% Core colors based on Tailwind blue-500
\definecolor{Primary}{RGB}{59, 130, 246}    % Main blue color (Tailwind blue-500)
\definecolor{PrimaryDark}{RGB}{30, 64, 175} % Darker blue for emphasis (Tailwind blue-800)
\definecolor{LightBg}{RGB}{239, 246, 255}   % Very light blue background (Tailwind blue-50)
\definecolor{TextDark}{RGB}{31, 41, 55}     % Dark text color (Tailwind gray-800)
\definecolor{TextMuted}{RGB}{107, 114, 128} % Secondary text color (Tailwind gray-500)

% --------- Header bar ---------
\begin{tikzpicture}[remember picture, overlay]
  \fill[Primary] ([xshift=0cm,yshift=0cm]current page.north west) rectangle ([xshift=\paperwidth,yshift=-0.4cm]current page.north west);
\end{tikzpicture}

\vspace{0.8cm}
\begin{center}
  {\fontsize{22}{26}\selectfont\sffamily\bfseries \textcolor{PrimaryDark}{CiteAssist}}\\[0.2em]
  {\Large\sffamily\scshape \textcolor{TextMuted}{Citation Sheet}}\\[0.8em]
  {\small\sffamily Generated with \href{https://citeassist.uni-goettingen.de/}{\textcolor{Primary}{\texttt{citeassist.uni-goettingen.de}}}
\IfPackageLoadedTF{annotation}{\CiteAssistCite{}}{}
  }\end{center}

\begin{center}
\vspace{1em}
\begin{tikzpicture}
\draw[Primary, line width=0.6pt] (0,0) -- (\textwidth,0);
\end{tikzpicture}
\vspace{1.2em}
\end{center}

% --------------  BibTeX block  -----------------
\begin{tcolorbox}[enhanced,
                 frame hidden,
                 boxrule=0pt,
                 borderline west={2pt}{0pt}{Primary},
                 colback=LightBg,
                 sharp corners,
                 breakable,
                 fonttitle=\sffamily\bfseries\large,
                 coltitle=Primary,
                 title=BibTeX Entry,
                 attach title to upper={\vspace{0.2em}\par},
                 left=12pt]
\begin{lstlisting}
${annotation}
\end{lstlisting}
\end{tcolorbox}

${onlineVersionSection}
${relatedPapersSection}

% ------ Footer with subtle design element ------
\vfill
\begin{tikzpicture}
\draw[Primary!40, line width=0.4pt] (0,0) -- (\textwidth,0);
\end{tikzpicture}
\begin{center}
\small\sffamily\textcolor{TextMuted}{Generated \today}
\end{center}`;
}