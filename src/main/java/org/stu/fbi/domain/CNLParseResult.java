package org.stu.fbi.domain;

/**
 * Представление результата обработки КЕЯ, возвращаемого на клиент
 * Created by Антон on 06.03.2018.
 */
public class CNLParseResult {

    private String OWL;
    private String OWLServerPath;
    private String frameJSON;

    public String getOWLServerPath() {
        return OWLServerPath;
    }

    public void setOWLServerPath(String OWLServerPath) {
        this.OWLServerPath = OWLServerPath;
    }

    public String getOWL() {
        return OWL;
    }

    public void setOWL(String OWL) {
        this.OWL = OWL;
    }

    public String getFrameJSON() {
        return frameJSON;
    }

    public void setFrameJSON(String frameJSON) {
        this.frameJSON = frameJSON;
    }
}
