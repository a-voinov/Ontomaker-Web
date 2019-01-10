# Ontomaker-Web
Web shell for presentation and analysis of Ontologies based on Controlled Natural Language (CNL)

<img src="https://www.tryimg.com/u/2019/01/10/start.png" alt="drawing" width="600"/>
(Screenshot made using WebVOWL web application)

## Goals

The system is intended for:
- editing and translation of CNL into ontology format for further analysis;
- selection of existing objects from triplets in the source text, as well as arbitrary text;
- ontology visualization;
- displaying frequency analysis results (ontology objects and the number of occurrences of words in the text), 
as well as the construction of histograms data.

## Demonstration

<img src="https://www.tryimg.com/u/2019/01/10/cnl.png" alt="drawing" width="600"/>
Web application main screen (Text tab)

It is assumed that the user will first enter the source text in the right input field, 
and then make up the CNL in the left input field for the text entered.

<img src="https://www.tryimg.com/u/2019/01/10/markup.png" alt="drawing" width="600"/>
Source markup  <br/><br/>

<img src="https://www.tryimg.com/u/2019/01/10/frame.png" alt="drawing" width="600"/>
OWL in Frame fashion  <br/><br/>

<img src="https://www.tryimg.com/u/2019/01/10/analysis.png" alt="drawing" width="600"/>
<img src="https://www.tryimg.com/u/2019/01/10/graph2.png" alt="drawing" width="300"/>
The tab "Analysis" shows the frequency of occurrence in the text of a certain word, and the histogram of the occurrence
of words, sorted in descending order. In addition, the original form of the word, the normalized form of the word 
and the total number of occurrences of the object in the text are displayed. 
The frequency is displayed as a percentage of the total number of words in the text. <br/><br/>

<img src="https://www.tryimg.com/u/2019/01/10/owl.png" alt="drawing" width="600"/>
Tab "Ontology" contains OWL-DL text of the generated ontology. <br/> <br/>

<img src="https://www.tryimg.com/u/2019/01/10/graph.png" alt="drawing" width="600"/>
The last tab  named "Ontograph" application demonstrates ontology visualization presented in the form of a graph.

## Text transformation process

- transformation of CNL into a triplet structure on the service side;
- transformation of the triplet structure into ontology (OWL format) on the server;
- transformation of the markup of the resulting ontology into the ontology visualization format (JSON \ V-OWL);
- text and ontology normalization on the service side;
- sending the received data to the client browser;
- source code processing, search for CNL objects in the text;
- markup of CNL and source text on the client side;
- generation of frequency analysis data on the occurrence of CNL objects in the text;
- obtaining statistical data of occurrences of words in the text;
- ontology output in the OWL-DL format.

## Used back-end technologies
- Java Web
- OWL API
- Gson
- Separate Visual OWL webapp (http://vowl.visualdataweb.org/) and OWL to VOWL converter

## Used front-end technologies
- jQuery
- Vue.js
- Component.js UI
- Chart.js
