package org.stu.fbi.onto.service;

import okhttp3.*;
import okio.Buffer;

import java.io.IOException;

/**
 * Created by Антон on 01.02.2018.
 */
public class Test {
    private static final String TRIPLET_API_TEST_URL = "https://rucnlparser.herokuapp.com/gettriplet/";

    public static String CallTestService(){
        //call to service
        OkHttpClient.Builder builder = new OkHttpClient.Builder();
        OkHttpClient client = builder.build();

        Request request = new Request.Builder()
                .url(TRIPLET_API_TEST_URL)
                .get()
                .build();

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
