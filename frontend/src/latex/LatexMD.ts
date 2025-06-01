export const latexMD = String.raw`USING ANNOTATION.STY AND ANNOTATION.TEX IN LATEX
==============================================

OVERVIEW
--------
This guide explains how to use the annotation.sty and annotation.tex files in your LaTeX document.
The annotation.sty file provides custom styling and environments for annotations, while 
annotation.tex contains predefined annotation content.

PREREQUISITES
------------
Ensure that both annotation.sty and annotation.tex are in the same directory as your main LaTeX document.

STEPS
-----

1. USING ANNOTATION.STY
   -------------------
   At the beginning of your LaTeX document, include the annotation.sty file by adding 
   the following line in the preamble (before \begin{document}):

   \usepackage{annotation}

    or without attribution

   \usepackage[noautocite]{annotation}


3. ADDING THE ANNOTATIONS SECTION
   ----------------------------
   To add the annotations section in your document, use \input or \include command
   to include annotation.tex. Typically, this is done at the end of your document:

   % ... Your document content ...
   
   \input{annotation.tex}


4. ADDING THE ANNOTATIONS BUTTON
   --------------------------
   To add the "Annotations" button to the top right corner of the first page, ideally
   right after the \maketitle command, you can use the \AddAnnotationRef command.

   \maketitle
   \AddAnnotationRef{}
`;