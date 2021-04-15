package com.app.medicalwebapp.clients.mirf;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class MirfOrchestratorClient {

    @Value("${mirf.orchestrator.url.pipeline.start}")
    private String mirfPipelineStartUrl;

    @Value("${mirf.orchestrator.url.sessionId}")
    private String mirfSessionIdUrl;

    public final static String DEFAULT_PIPELINE = "[\n" +
            "  { \"id\": 0, \"blockType\" : \"DicomImageSeriesReaderAlg\", \"children\": [1, 3] },\n" +
            "  { \"id\": 1, \"blockType\" : \"DicomAddCircleMaskAlg\", \"children\": [2] },\n" +
            "  { \"id\": 2, \"blockType\" : \"ConvertHighlightedDicomImagesToPdfAlg\", \"children\": [4] },\n" +
            "  { \"id\": 3, \"blockType\" : \"ConvertDicomImagesToPdfAlg\", \"children\": [4] },\n" +
            "  { \"id\": 4, \"blockType\" : \"PdfFileCreatorAlg\", \"children\": [] }\n" +
            "]\n";

    public final static String DEFAULT_PIPELINE2 = "[\n" +
            "  { \"id\": 0, \"blockType\" : \"PipelineForDeveloping\", \"children\": [] }\n" +
            "]\n";

    public final static String IHD_PIPELINE = "[\n" +
            "  { \"id\": 0, \"blockType\" : \"IhdDataReaderAlg\", \"children\": [] }\n" +
            "]\n";

    private CloseableHttpClient httpclient = HttpClients.createDefault();

    public Boolean processPipeline(String sessionId, String pipelineConfiguration) throws IOException {

        HttpPost post = new HttpPost(mirfPipelineStartUrl);

        MultipartEntityBuilder builder = MultipartEntityBuilder.create();

        builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
        builder.addTextBody("sessionId", sessionId, ContentType.DEFAULT_BINARY);
        builder.addTextBody("pipeline", pipelineConfiguration, ContentType.DEFAULT_BINARY);

        HttpEntity entity = builder.build();
        post.setEntity(entity);

        HttpResponse response = httpclient.execute(post);

        return response.getStatusLine().getStatusCode() == 200;
    }

    public String getSessionId() throws Exception {

        HttpGet request = new HttpGet(mirfSessionIdUrl);

        try (CloseableHttpClient httpClient = HttpClients.createDefault();
             CloseableHttpResponse response = httpClient.execute(request)) {

            HttpEntity entity = response.getEntity();
            if (response.getStatusLine().getStatusCode() == 200 && entity != null) {
                String sessionId = EntityUtils.toString(entity);
                System.out.println(sessionId);
                return sessionId;
            } else {
                System.out.println(response.getStatusLine().getStatusCode());
                throw new Exception("Mirf service unavailable");
            }
        }
    }
}
