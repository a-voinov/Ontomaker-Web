/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.stu.fbi.onto.domain;

import java.util.List;

/**
 *
 * Created by Антон on 18.12.2017.
 */
public class TripletsWrapper {
    
    private List<Triplet> triplets;

    public List<Triplet> getTriplets() {
        return triplets;
    }

    public void setTriplets(List<Triplet> triplets) {
        this.triplets = triplets;
    }

    @Override
    public String toString() {
        return "TripletsWrapper{" + "triplets=" + triplets + '}';
    }

}
