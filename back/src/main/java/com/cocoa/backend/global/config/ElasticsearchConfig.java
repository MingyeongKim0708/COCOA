package com.cocoa.backend.global.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.elasticsearch.client.RestClient;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

// Elasticsearch와 SpringBoot 연결 설정
// @Configuration : 클래스가 1개 이상의 빈을 정의하고 spring context에서 관리됨
@Configuration
@EnableElasticsearchRepositories(basePackages = "com.cocoa.backend.domain.search.repository")
public class ElasticsearchConfig {

    // @Value : application.yml 파일에 정의된 값을 읽어옴
    @Value("${spring.elasticsearch.uris}")
    private String uri;

    @Value("${spring.elasticsearch.username}")
    private String username;

    @Value("${spring.elasticsearch.password}")
    private String password;

    private final ObjectMapper objectMapper;

    public ElasticsearchConfig(ObjectMapper objectMapper) {
                this.objectMapper = objectMapper;
    }

    // ElasticsearchClient Bean 생성
    // @Bean : 반환된 객체(ElasticsearchClient)를 spring context에서 관리되는 bean으로 등록
    @Bean
    public ElasticsearchClient elasticsearchClient() {
        // URI 파싱(localhost:9200)
        String host = uri.split(":")[0];
        int port = Integer.parseInt(uri.split(":")[1]);
        // 인증 정보 설정(ES 서버에 인증하기 위한 username, password 설정)
        // BasicCredentialsProvider : HTTP 요청에 인증 정보를 포함시키는 역할
        CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        credentialsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(username, password));
        // HTTP 클라이언트 생성
        // 인증 정보 포함, ES 서버의 통신 담당
        CloseableHttpClient httpClient = HttpClients.custom().setDefaultCredentialsProvider(credentialsProvider).build();
        // 저수준 RestClient 생성
        // HTTP 요청 전송&응답 수신
        // HttpHost(host, port) : ES 서버의 호스트와 포트 지정
        RestClient restClient = RestClient.builder(new HttpHost(host, port)).setHttpClientConfigCallback(httpAsyncClientBuilder -> httpAsyncClientBuilder.setDefaultCredentialsProvider(credentialsProvider)).build();
        //Transport 설정, Elasticsearch 고수준 클라이언트(색인 생성, 문서 검색) 반환
        RestClientTransport transport = new RestClientTransport(restClient, new JacksonJsonpMapper(objectMapper));

        return new ElasticsearchClient(transport);

    }

//    @Bean
//    // Jackson ObjectMapper 빈 등록
//    public ObjectMapper objectMapper() {
//        return new ObjectMapper();
//    }
}


// RestClient : es 서버 - HTTP 통신을 담당하는 저수준 클라이언트
// JacksonMapper : json - java 객체 직렬화/역직렬화
// ElasticsearchMapper : Elasticsearch 문서 - java 객체 매핑(ElasticsearchClient 내부 사용 매퍼)