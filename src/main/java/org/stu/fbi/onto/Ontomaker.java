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

    private final String MY_IRI = "http://onto.plus/animals.owl";
    private String ONTOLOGY_PATH;
    private final String ONTOLOGY_SUBCLASS_RELATION = "подкласс";

    /**
     *
     * @param CNL controlled natural language text
     * @return owl server file path
     * @throws Exception
     */
    public String CreteOWL(String CNL) throws Exception {

        Date date = new Date();
        DateFormat dateFormat = new SimpleDateFormat("hh:mm:ss yyyy-MM-dd");
        ONTOLOGY_PATH = "ontology" + dateFormat.format(date).replace(":", "-") + ".owl";

        Gson g = new Gson();
        //запрос на получение КЕЯ в триплетной форме от сервиса
        String json = TripletsRetriever.GetTriplets(CNL);
        //парс триплетов из JSON в объектную форму
        TripletsWrapper tripletsWrapper = g.fromJson(json, TripletsWrapper.class);

        //создание owl документа
        TripletParser tripletParser;
        try {
            tripletParser = new TripletParser(MY_IRI, ONTOLOGY_SUBCLASS_RELATION,
                    tripletsWrapper);
        } catch (OWLOntologyCreationException e) {
            throw new Exception("Ошибка создания онтологии");
        }

        try {
            tripletParser.ParseAndSave(ONTOLOGY_PATH);

            //STU watermark
            BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(ONTOLOGY_PATH, true));
            bufferedWriter.write("<!--[Siberian Transport University] Parsed from the CNL by the CNL-Ontomaker-1.0 at " + dateFormat.format(date) + "-->");
            bufferedWriter.close();
        } catch (Exception e) {
            throw new Exception("Ошибка сохранения онтологии");
        }

        return ONTOLOGY_PATH;
    }

    public String getOWLText() throws Exception {
        byte[] encoded = Files.readAllBytes(Paths.get(ONTOLOGY_PATH));
        return new String(encoded, "UTF-8");
    }

}
