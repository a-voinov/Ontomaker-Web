package org.stu.fbi.onto;

import java.io.IOException;

/**
 * Created by Антон on 06.03.2018.
 */
public class VOWLMaker {

    /**
     * Запуск конвертера из owl в vowl
     * @param owlPath
     * @return path to json
     */
    public String RunParser(String jarPath, String owlPath, String jsonPath) throws IOException, InterruptedException {
        System.out.println( "owl path:" +  owlPath);
        System.out.println( "vowl path:" +  jsonPath);
        ProcessBuilder pb = new ProcessBuilder(
                 "java",
                 "-jar",
                 jarPath,
                 "-file",
                 owlPath,
                 "-output",
                 jsonPath);
         Process process = pb.start();
         if (process.waitFor() != 0){
             throw new IOException();
         }
         return jsonPath
                 .substring(jsonPath.indexOf("data\\"))
                 .replace("\\", "/");
    }

}
