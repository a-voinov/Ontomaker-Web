package org.stu.fbi.onto.parser;

import org.semanticweb.owlapi.apibinding.OWLManager;
import org.semanticweb.owlapi.formats.OWLXMLDocumentFormat;
import org.semanticweb.owlapi.model.*;
import org.stu.fbi.onto.domain.Triplet;
import org.stu.fbi.onto.domain.TripletsWrapper;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * Created by Антон on 18.12.2017.
 */
public class TripletParser {

    private static final String ONTOLOGY_ROOT_SUBJ = "Root";

    private String iri;
    private String subclassRelation;
    private TripletsWrapper tripletsWrapper;

    private OWLOntologyManager manager;
    private OWLOntology ontology;
    private OWLDataFactory df;

    public TripletParser(String iri, String subclassRelation, TripletsWrapper tripletsWrapper) throws OWLOntologyCreationException {
        this.iri = iri;
        this.subclassRelation = subclassRelation;
        this.tripletsWrapper = tripletsWrapper;

        manager = OWLManager.createOWLOntologyManager();
        ontology = manager.createOntology(IRI.create(iri));
        df = OWLManager.getOWLDataFactory();
    }

    public void ParseAndSave(String savePath) throws OWLOntologyStorageException, IOException {
        for (Triplet triplet : tripletsWrapper.getTriplets()) {
            //checking root
            if (triplet.getSubject().equals(ONTOLOGY_ROOT_SUBJ)){
                AddClassToRoot(triplet);
            } else {
                //checking subclass
                if (triplet.getRelation().equals(subclassRelation)){
                    AddSubclass(triplet);
                } else {
                    //новое свойство класса
                    AddClassProperty(triplet);
                }
            }
        }

        //сохранение в файл
        File file = new File(savePath);
        file.createNewFile();
        FileOutputStream fos = new FileOutputStream(file, false);
        manager.saveOntology(ontology, new OWLXMLDocumentFormat(), fos);
        fos.close();
    }

    private void AddClassProperty(Triplet triplet){
        OWLClass classA = df.getOWLClass(IRI.create(iri + "#" + triplet.getSubject()));
        OWLClass classB = df.getOWLClass(IRI.create(iri + "#" + triplet.getObject()));
        OWLObjectProperty property = df.getOWLObjectProperty(IRI.create(iri + "#" + triplet.getRelation()));
        OWLClassExpression hasProperty = df.getOWLObjectSomeValuesFrom(property, classB);
        OWLSubClassOfAxiom subAxiom = df.getOWLSubClassOfAxiom(classA, hasProperty);
        AddAxiom axiom = new AddAxiom(ontology, subAxiom);
        manager.applyChange(axiom);
    }

    private void AddClassToRoot(Triplet triplet){
        OWLClass rootClass = df.getOWLClass(IRI.create(iri + "#" + triplet.getObject()));
        OWLAxiom axiom = df.getOWLDeclarationAxiom(rootClass);
        AddAxiom addAxiom = new AddAxiom(ontology, axiom);
        manager.applyChange(addAxiom);
    }

    private void AddSubclass(Triplet triplet){
        OWLClass classA = df.getOWLClass(IRI.create(iri + "#" + triplet.getSubject()));
        OWLClass classB = df.getOWLClass(IRI.create(iri + "#" + triplet.getObject()));
        OWLAxiom axiom = df.getOWLSubClassOfAxiom(classA, classB);
        AddAxiom addAxiom = new AddAxiom(ontology, axiom);
        manager.applyChange(addAxiom);
    }

}
