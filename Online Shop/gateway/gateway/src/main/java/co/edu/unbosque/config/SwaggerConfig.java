package co.edu.unbosque.config;

import java.util.ArrayList;
import java.util.List;

import org.springdoc.core.models.GroupedOpenApi;
import org.springdoc.core.properties.SwaggerUiConfigParameters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class SwaggerConfig {

    @Autowired
    private SwaggerUiConfigParameters swaggerUiConfigParameters;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Virtual Shop API Gateway")
                        .description("API Gateway para microservicios de la tienda virtual")
                        .version("1.0.0"));
    }

    @Bean
    public List<GroupedOpenApi> apis() {
        List<GroupedOpenApi> groups = new ArrayList<>();
        
        // Client Service
        GroupedOpenApi clientGroup = GroupedOpenApi.builder()
                .group("client")
                .displayName("Client Service")
                .addOpenApiCustomizer(openApi -> openApi.info(new Info()
                        .title("Client Service API")
                        .description("API para gestión de clientes")
                        .version("1.0")))
                .build();
        
        // Product Service
        GroupedOpenApi productGroup = GroupedOpenApi.builder()
                .group("product")
                .displayName("Product Service")
                .addOpenApiCustomizer(openApi -> openApi.info(new Info()
                        .title("Product Service API")
                        .description("API para gestión de productos")
                        .version("1.0")))
                .build();

        // User Service
        GroupedOpenApi userGroup = GroupedOpenApi.builder()
                .group("user")
                .displayName("User Service")
                .addOpenApiCustomizer(openApi -> openApi.info(new Info()
                        .title("User Service API")
                        .description("API para gestión de usuarios")
                        .version("1.0")))
                .build();

        // Sale Detail Service
        GroupedOpenApi saleDetailGroup = GroupedOpenApi.builder()
                .group("saledetail")
                .displayName("Sale Detail Service")
                .addOpenApiCustomizer(openApi -> openApi.info(new Info()
                        .title("Sale Detail Service API")
                        .description("API para gestión de detalles de venta")
                        .version("1.0")))
                .build();

        // Sale Service
        GroupedOpenApi saleGroup = GroupedOpenApi.builder()
                .group("sale")
                .displayName("Sale Service")
                .addOpenApiCustomizer(openApi -> openApi.info(new Info()
                        .title("Sale Service API")
                        .description("API para gestión de ventas")
                        .version("1.0")))
                .build();

        // Provider Service
        GroupedOpenApi providerGroup = GroupedOpenApi.builder()
                .group("provider")
                .displayName("Provider Service")
                .addOpenApiCustomizer(openApi -> openApi.info(new Info()
                        .title("Provider Service API")
                        .description("API para gestión de proveedores")
                        .version("1.0")))
                .build();
        
        // Agregar todos los grupos
        groups.add(clientGroup);
        groups.add(productGroup);
        groups.add(userGroup);
        groups.add(saleDetailGroup);
        groups.add(saleGroup);
        groups.add(providerGroup);
        
        // Agregar los grupos a SwaggerUI
        swaggerUiConfigParameters.addGroup("client");
        swaggerUiConfigParameters.addGroup("product");
        swaggerUiConfigParameters.addGroup("user");
        swaggerUiConfigParameters.addGroup("saledetail");
        swaggerUiConfigParameters.addGroup("sale");
        swaggerUiConfigParameters.addGroup("provider");

        return groups;
    }
}
