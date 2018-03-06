package org.stu.fbi.onto;

import com.google.gson.Gson;
import org.semanticweb.owlapi.model.OWLOntologyCreationException;
import org.stu.fbi.onto.domain.TripletsWrapper;
import org.stu.fbi.onto.parser.TripletParser;
import org.stu.fbi.onto.service.TripletsRetriever;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;

/**
 * Created by Антон on 01.02.2018.
 */
public class Ontomaker {

    private final String IRI = "http://onto.plus/";
    private final String ONTOLOGY_SUBCLASS_RELATION = "подкласс";
    private String filePath;

    //triplets JSON
    private String tripletsJSON;

    /**
     *
     * @param CNL controlled natural language text
     * @return owl server file path
     * @throws Exception
     */
    public String CreateOWL(String CNL, String iri, String owlPath) throws Exception {

        iri = IRI + iri + ".owl";

        Date date = new Date();
        DateFormat dateFormat = new SimpleDateFormat("hh:mm:ss yyyy-MM-dd");
        String ontologyName = "ontology" + dateFormat.format(date).replace(":", "-").replace(" ", "_") + ".owl";
        filePath = owlPath + "\\" + ontologyName;

        Gson g = new Gson();
        //запрос на получение КЕЯ в триплетной форме от сервиса
        tripletsJSON = TripletsRetriever.GetTriplets(CNL);
        //парс триплетов из JSON в объектную форму
        TripletsWrapper tripletsWrapper = g.fromJson(tripletsJSON, TripletsWrapper.class);

        //создание owl документа
        TripletParser tripletParser;
        try {
            tripletParser = new TripletParser(iri, ONTOLOGY_SUBCLASS_RELATION,
                    tripletsWrapper);
        } catch (OWLOntologyCreationException e) {
            throw new Exception("Ошибка создания онтологии");
        }

        try {
            tripletParser.ParseAndSave(filePath);
            //STU watermark
            BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(filePath, true));
            bufferedWriter.write("<!--[Siberian Transport University] Parsed from the CNL by the CNL-Ontomaker-1.0 at " + dateFormat.format(date) + "-->");
            bufferedWriter.close();
        } catch (Exception e) {
            throw new Exception("Ошибка сохранения онтологии");
        }

        return filePath;
    }

    public String getOWLText() throws Exception {
        byte[] encoded = Files.readAllBytes(Paths.get(filePath));
        return new String(encoded, "UTF-8");
    }

    public String getTripletsJSON() {
        return tripletsJSON;
    }
}
