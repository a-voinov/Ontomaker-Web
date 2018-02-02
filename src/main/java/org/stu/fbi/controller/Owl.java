package org.stu.fbi.controller;

import org.stu.fbi.onto.Ontomaker;

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
    @Override
    protected void doPost(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws ServletException, IOException {
        httpServletRequest.setCharacterEncoding("UTF-8");
        httpServletResponse.setCharacterEncoding("UTF-8");
        httpServletResponse.setContentType("text/plain");

        String cnl = httpServletRequest.getParameter("cnl");
        Ontomaker ontomaker = new Ontomaker();
        try {
            String filePath = ontomaker.CreteOWL(cnl);
            String text = ontomaker.getOWLText();
            httpServletResponse.getWriter().write(text);
        } catch (Exception e) {
            e.printStackTrace();
            httpServletResponse.getWriter().write(e.getMessage());
        }
    }
}
