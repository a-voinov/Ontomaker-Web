/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.stu.fbi.onto.domain;

/**
 *
 * Created by Антон on 18.12.2017.
 */
public class Triplet {
    
    private String object;
    private String relation;
    private String subject;

    public Triplet() {
    }

    
    
    public Triplet(String class1, String rel, String class2) {
        this.object = class1;
        this.relation = rel;
        this.subject = class2;
    }

    public String getObject() {
        return object;
    }

    public void setObject(String object) {
        this.object = object;
    }

    public String getRelation() {
        return relation;
    }

    public void setRelation(String relation) {
        this.relation = relation;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    
    
    @Override
    public String toString() {
        return "Triplet{" + "object=" + object + ", relation=" + relation + ", subject=" + subject + '}';
    }

    
}
