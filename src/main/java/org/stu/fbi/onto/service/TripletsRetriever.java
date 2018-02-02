/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.stu.fbi.onto.service;

import okhttp3.*;
import okio.Buffer;

import java.io.IOException;

/**
 *
 * Created by Антон on 18.12.2017.
 */
public class TripletsRetriever {
    private static final String TRIPLET_API_URL = "https://rucnlparser.herokuapp.com/gettriplets/";
    private static final String TRIPLET_API_TRANSLATION_URL = "https://rucnlparser.herokuapp.com/getcnltranslation/";
    
    public static String TranslateTriplets(String kea, String language){
        //call to service
        OkHttpClient.Builder builder = new OkHttpClient.Builder();
        OkHttpClient client = builder.build();
        RequestBody requestBody;
            requestBody = new FormBody.Builder()
                .add("text", kea)
                .add("lang", language)
                .build();
        
        Request request = new Request.Builder()
                            .url(TRIPLET_API_TRANSLATION_URL)
                            .post(requestBody)
                            .build();  
        //System.out.println(bodyToString(request));
        
        try {
            Response response = client.newCall(request).execute();
            return response.body().string();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    public static String GetTriplets(String kea){

        //call to service
        OkHttpClient.Builder builder = new OkHttpClient.Builder();
        OkHttpClient client = builder.build();
        RequestBody requestBody;
            requestBody = new FormBody.Builder()
                .add("text", kea)
                .build();
        
        Request request = new Request.Builder()
                            .url(TRIPLET_API_URL)
                            .post(requestBody)
                            .build();  
        //System.out.println(bodyToString(request));
        
        try {
            Response response = client.newCall(request).execute();
            return response.body().string();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private static String bodyToString(final Request request){
        try {
            final Request copy = request.newBuilder().build();
            final Buffer buffer = new Buffer();
            copy.body().writeTo(buffer);
            return buffer.readUtf8();
        } catch (final IOException e) {
            return "did not work";
        }
    }
    
}
