<br />
<p align="center">
<a><img src="images/gipplab.png" alt="CiteAssist" width="128" height="128" title="CiteAssist"></a>
  <h3 align="center">CiteAssist</h3>
  <p align="center">
    CiteAssist generates preprints, suggests related papers, and adds BibTeX annotation to the PDF <br />
    <p align="center">
  <a href="https://github.com/gipplab/preprint_generator/actions"><img src="https://github.com/gipplab/preprint_generator/actions/workflows/main.yml/badge.svg" alt="Build Status"></a>
  <a href="https://github.com/gipplab/preprint_generator/blob/main/LICENSE"><img src="https://img.shields.io/github/license/gipplab/preprint_generator" alt="License"></a>
  <a href="https://github.com/gipplab/preprint_generator/network/members"><img src="https://img.shields.io/github/forks/gipplab/preprint_generator?style=social" alt="GitHub forks"></a>
  <a href="https://github.com/gipplab/preprint_generator/stargazers"><img src="https://img.shields.io/github/stars/gipplab/preprint_generator?style=social" alt="GitHub stars"></a>
</p>
    <p>
    <a href="https://github.com/gipplab/preprint_generator/issues">Report Bug</a>
    ·
    <a href="https://github.com/gipplab/preprint_generator/issues">Request Feature</a>
  </p>
</p>

Try <a href="https://citeassist.uni-goettingen.de/" title="CiteAssist" alt="cite assist tool">CiteAssist</a>!

CiteAssist is a powerful tool that allows users to generate preprints with suggested related papers and add a BibTeX annotation to the PDF.

## Prerequisites

To use CiteAssist, you must have Node version 16.13.0 or higher installed on your machine.

## Getting Started

To get started, simply clone this repository and follow the instructions in the frontend and backend READMEs:

 - [Frontend README](frontend/README.md)
 - [Backend README](backend/README.md)

## Features

CiteAssist offers the following features:

 - Generate preprints with related papers: The tool utilizes powerful algorithms to suggest related papers to include in your preprint, helping you to create more comprehensive and impactful research.
 - Add a BibTeX annotation to the PDF: The tool also generates a BibTeX annotation, which can be used to easily cite your preprint in other works.

## Contributing

We welcome contributions to CiteAssist! If you encounter a bug, have a feature request, or would like to contribute code, please open an issue or pull request on this repository.

## License 

This project is licensed under the MIT License. Please refer to the [LICENSE](COPYING) file for more information.

## Citation

If you use this software, please cite it using the following BibTeX entry:

```bibtex
@software{kaesberg2024,
  author = {Kaesberg, Lars Benedikt and Ruas, Terry and Wahle, Jan Philip and Gipp, Bela},
  license = {MIT},
  month = jul,
  title = {{CiteAssist: A System for Automated Preprint Citation and BibTeX Generation}},
  version = {1.0},
  year = {2024}
}
```

## TODO

- [ ] use [compromise](https://www.npmjs.com/package/compromise) for nlp keyword detection
- [x] website for each preprint in backend (pdf, annotation, related papers)
- [ ] [alpaca lora](https://github.com/tloen/alpaca-lora) for metadata extraction
