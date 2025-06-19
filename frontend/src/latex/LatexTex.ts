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
  \CiteAssistCite{}
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
\lstset{
    inputencoding = utf8,  % Input encoding
    extendedchars = true,  % Extended ASCII
    literate      =        % Support additional characters
      {á}{{\'a}}1  {é}{{\'e}}1  {í}{{\'i}}1 {ó}{{\'o}}1  {ú}{{\'u}}1
      {Á}{{\'A}}1  {É}{{\'E}}1  {Í}{{\'I}}1 {Ó}{{\'O}}1  {Ú}{{\'U}}1
      {à}{{\`a}}1  {è}{{\`e}}1  {ì}{{\`i}}1 {ò}{{\`o}}1  {ù}{{\`u}}1
      {À}{{\`A}}1  {È}{{\`E}}1  {Ì}{{\`I}}1 {Ò}{{\`O}}1  {Ù}{{\`U}}1
      {ä}{{\"a}}1  {ë}{{\"e}}1  {ï}{{\"i}}1 {ö}{{\"o}}1  {ü}{{\"u}}1
      {Ä}{{\"A}}1  {Ë}{{\"E}}1  {Ï}{{\"I}}1 {Ö}{{\"O}}1  {Ü}{{\"U}}1
      {â}{{\^a}}1  {ê}{{\^e}}1  {î}{{\^i}}1 {ô}{{\^o}}1  {û}{{\^u}}1
      {Â}{{\^A}}1  {Ê}{{\^E}}1  {Î}{{\^I}}1 {Ô}{{\^O}}1  {Û}{{\^U}}1
      {œ}{{\oe}}1  {Œ}{{\OE}}1  {æ}{{\ae}}1 {Æ}{{\AE}}1  {ß}{{\ss}}1
      {ẞ}{{\SS}}1  {ç}{{\c{c}}}1 {Ç}{{\c{C}}}1 {ø}{{\o}}1  {Ø}{{\O}}1
      {å}{{\aa}}1  {Å}{{\AA}}1  {ã}{{\~a}}1  {õ}{{\~o}}1 {Ã}{{\~A}}1
      {Õ}{{\~O}}1  {ñ}{{\~n}}1  {Ñ}{{\~N}}1  {¿}{{?\`}}1  {¡}{{!\`}}1
      {„}{\quotedblbase}1 {“}{\textquotedblleft}1 {–}{$-$}1
      {°}{{\textdegree}}1 {º}{{\textordmasculine}}1 {ª}{{\textordfeminine}}1
      {£}{{\pounds}}1  {©}{{\copyright}}1  {®}{{\textregistered}}1
      {«}{{\guillemotleft}}1  {»}{{\guillemotright}}1  {Ð}{{\DH}}1  {ð}{{\dh}}1
      {Ý}{{\'Y}}1    {ý}{{\'y}}1    {Þ}{{\TH}}1    {þ}{{\th}}1    {Ă}{{\u{A}}}1
      {ă}{{\u{a}}}1  {Ą}{{\k{A}}}1  {ą}{{\k{a}}}1  {Ć}{{\'C}}1    {ć}{{\'c}}1
      {Č}{{\v{C}}}1  {č}{{\v{c}}}1  {Ď}{{\v{D}}}1  {ď}{{\v{d}}}1  {Đ}{{\DJ}}1
      {đ}{{\dj}}1    {Ė}{{\.{E}}}1  {ė}{{\.{e}}}1  {Ę}{{\k{E}}}1  {ę}{{\k{e}}}1
      {Ě}{{\v{E}}}1  {ě}{{\v{e}}}1  {Ğ}{{\u{G}}}1  {ğ}{{\u{g}}}1  {Ĩ}{{\~I}}1
      {ĩ}{{\~\i}}1   {Į}{{\k{I}}}1  {į}{{\k{i}}}1  {İ}{{\.{I}}}1  {ı}{{\i}}1
      {Ĺ}{{\'L}}1    {ĺ}{{\'l}}1    {Ľ}{{\v{L}}}1  {ľ}{{\v{l}}}1  {Ł}{{\L{}}}1
      {ł}{{\l{}}}1   {Ń}{{\'N}}1    {ń}{{\'n}}1    {Ň}{{\v{N}}}1  {ň}{{\v{n}}}1
      {Ő}{{\H{O}}}1  {ő}{{\H{o}}}1  {Ŕ}{{\'{R}}}1  {ŕ}{{\'{r}}}1  {Ř}{{\v{R}}}1
      {ř}{{\v{r}}}1  {Ś}{{\'S}}1    {ś}{{\'s}}1    {Ş}{{\c{S}}}1  {ş}{{\c{s}}}1
      {Š}{{\v{S}}}1  {š}{{\v{s}}}1  {Ť}{{\v{T}}}1  {ť}{{\v{t}}}1  {Ũ}{{\~U}}1
      {ũ}{{\~u}}1    {Ū}{{\={U}}}1  {ū}{{\={u}}}1  {Ů}{{\r{U}}}1  {ů}{{\r{u}}}1
      {Ű}{{\H{U}}}1  {ű}{{\H{u}}}1  {Ų}{{\k{U}}}1  {ų}{{\k{u}}}1  {Ź}{{\'Z}}1
      {ź}{{\'z}}1    {Ż}{{\.Z}}1    {ż}{{\.z}}1    {Ž}{{\v{Z}}}1  {ž}{{\v{z}}}1
      % ¿ and ¡ are not correctly displayed if inconsolata font is used
      % together with the lstlisting environment. Consider typing code in
      % external files and using \lstinputlisting to display them instead.      
  }
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