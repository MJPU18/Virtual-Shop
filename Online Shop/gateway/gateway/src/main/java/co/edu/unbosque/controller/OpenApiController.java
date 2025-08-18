package co.edu.unbosque.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

import reactor.core.publisher.Mono;

@RestController
public class OpenApiController {

    @Autowired
    private RouteLocator routeLocator;

    private final WebClient webClient = WebClient.builder().build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/v3/api-docs/client")
    public Mono<String> getClientServiceOpenApi(ServerHttpRequest request) {
        return webClient.get()
                .uri("http://localhost:8085/v3/api-docs")
                .retrieve()
                .bodyToMono(String.class)
                .map(json -> updatePaths(json, "/api/clients"));
    }

    @GetMapping("/v3/api-docs/product")
    public Mono<String> getProductServiceOpenApi(ServerHttpRequest request) {
        return webClient.get()
                .uri("http://localhost:8084/v3/api-docs")
                .retrieve()
                .bodyToMono(String.class)
                .map(json -> updatePaths(json, "/api/products"));
    }

    @GetMapping("/v3/api-docs/user")
    public Mono<String> getUserServiceOpenApi(ServerHttpRequest request) {
        return webClient.get()
                .uri("http://localhost:8086/v3/api-docs")
                .retrieve()
                .bodyToMono(String.class)
                .map(json -> updatePaths(json, "/api/users"));
    }

    @GetMapping("/v3/api-docs/saledetail")
    public Mono<String> getSaleDetailServiceOpenApi(ServerHttpRequest request) {
        return webClient.get()
                .uri("http://localhost:8081/v3/api-docs")
                .retrieve()
                .bodyToMono(String.class)
                .map(json -> updatePaths(json, "/api/salesdetails"));
    }

    @GetMapping("/v3/api-docs/sale")
    public Mono<String> getSaleServiceOpenApi(ServerHttpRequest request) {
        return webClient.get()
                .uri("http://localhost:8082/v3/api-docs")
                .retrieve()
                .bodyToMono(String.class)
                .map(json -> updatePaths(json, "/api/sales"));
    }

    @GetMapping("/v3/api-docs/provider")
    public Mono<String> getProviderServiceOpenApi(ServerHttpRequest request) {
        return webClient.get()
                .uri("http://localhost:8083/v3/api-docs")
                .retrieve()
                .bodyToMono(String.class)
                .map(json -> updatePaths(json, "/api/providers"));
    }

    private String updatePaths(String openApiJson, String pathPrefix) {
        try {
            JsonNode rootNode = objectMapper.readTree(openApiJson);
            ObjectNode objectNode = (ObjectNode) rootNode;

            // Actualizar servers para apuntar al gateway
            ArrayNode servers = objectMapper.createArrayNode();
            ObjectNode server = objectMapper.createObjectNode();
            server.put("url", "http://localhost:8080");
            server.put("description", "Gateway server");
            servers.add(server);
            objectNode.set("servers", servers);

            // Actualizar todos los paths para incluir el prefijo del gateway
            ObjectNode paths = (ObjectNode) objectNode.get("paths");
            ObjectNode newPaths = objectMapper.createObjectNode();

            paths.fieldNames().forEachRemaining(path -> {
                String newPath = pathPrefix + path;
                newPaths.set(newPath, paths.get(path));
            });

            objectNode.set("paths", newPaths);
            
            return objectMapper.writeValueAsString(objectNode);
        } catch (Exception e) {
            e.printStackTrace();
            return openApiJson; // Fallback al original si hay error
        }
    }
}