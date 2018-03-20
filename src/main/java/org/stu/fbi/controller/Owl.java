package org.stu.fbi.controller;

import com.google.gson.Gson;
import org.stu.fbi.domain.CNLParseResult;
import org.stu.fbi.onto.Ontomaker;
import org.stu.fbi.onto.VOWLMaker;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by Антон on 02.02.2018.
 */
@WebServlet(name = "Owl", urlPatterns = "/Owl")
public class Owl extends HttpServlet {

    private final String OWL2VOWL_PATH = "/WEB-INF/lib/owl2vowl.jar";

    @Override
    protected void doPost(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws ServletException, IOException {
        httpServletRequest.setCharacterEncoding("UTF-8");
        httpServletResponse.setCharacterEncoding("UTF-8");
        httpServletResponse.setContentType("text/plain");

        String cnl = httpServletRequest.getParameter("cnl");
        String iri = httpServletRequest.getParameter("iri");
        Ontomaker ontomaker = new Ontomaker();
        VOWLMaker vowlMaker = new VOWLMaker();
        try {
            String owlSavePath = getServletContext().getRealPath("\\data\\owl\\");
            String vowlJarPath = getServletContext().getRealPath(OWL2VOWL_PATH);
            String owlFilePath = ontomaker.CreateOWL(cnl, iri, owlSavePath);
            //конвертация из owl в vowl
            String jsonPath = getServletContext().getRealPath("\\data\\vowl\\" + owlFilePath
                    .substring(owlFilePath.indexOf("\\owl\\"))
                    .replace(".owl", ".json")
                    .replace("\\owl\\","")
                    .replace(" ", "_"));
            String vowlFilePath = vowlMaker.RunParser(vowlJarPath, owlFilePath, jsonPath);
            String OWL = ontomaker.getOWLText();
            String frameJSON = ontomaker.getTripletsJSON();
            //TODO собрать фреймы из триплетной формы
            //сборка объекта с результатом обработки КЕЯ
            CNLParseResult parseResult = new CNLParseResult();
            parseResult.setOWLServerPath(vowlFilePath);
            parseResult.setOWL(OWL);
            parseResult.setFrameJSON(frameJSON);
            //Парс результирующего объекта в JSON и отправка на клиент
            String jsonRes = new Gson().toJson(parseResult);
            httpServletResponse.getWriter().write(jsonRes);
        } catch (Exception e) {
            e.printStackTrace();
            httpServletResponse.getWriter().write("ERROR:" + e.getMessage());
        }
    }
}
