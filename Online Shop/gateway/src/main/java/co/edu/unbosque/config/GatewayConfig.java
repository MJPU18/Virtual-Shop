package co.edu.unbosque.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Rutas para el microservicio de Clientes
                .route("client-service", r -> r
                        .path("/api/clients/**")
                        .filters(f -> f
                                .stripPrefix(2)
                                .addRequestHeader("X-Request-Source", "gateway"))
                        .uri("lb://client-service")) // Usar nombre de servicio Docker
                
                // Rutas para el microservicio de Productos
                .route("product-service", r -> r
                        .path("/api/products/**")
                        .filters(f -> f
                                .stripPrefix(2)
                                .addRequestHeader("X-Request-Source", "gateway"))
                        .uri("lb://product-service")) // Usar nombre de servicio Docker
                
                // Rutas para el microservicio de Usuarios
                .route("user-service", r -> r
                        .path("/api/users/**")
                        .filters(f -> f
                                .stripPrefix(2)
                                .addRequestHeader("X-Request-Source", "gateway"))
                        .uri("lb://user-service")) // Usar nombre de servicio Docker
                
                // Rutas para el microservicio de Detalles de Venta
                .route("saledetail-service", r -> r
                        .path("/api/salesdetails/**")
                        .filters(f -> f
                                .stripPrefix(2)
                                .addRequestHeader("X-Request-Source", "gateway"))
                        .uri("lb://saledetail-service")) // Usar nombre de servicio Docker
                
                // Rutas para el microservicio de Ventas
                .route("sale-service", r -> r
                        .path("/api/sales/**")
                        .filters(f -> f
                                .stripPrefix(2)
                                .addRequestHeader("X-Request-Source", "gateway"))
                        .uri("lb://sale-service")) // Usar nombre de servicio Docker
                
                // Rutas para el microservicio de Proveedores
                .route("provider-service", r -> r
                        .path("/api/providers/**")
                        .filters(f -> f
                                .stripPrefix(2)
                                .addRequestHeader("X-Request-Source", "gateway"))
                        .uri("lb://provider-service")) // Usar nombre de servicio Docker
                .build();
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowCredentials(false);
        corsConfig.addAllowedOriginPattern("*");
        corsConfig.addAllowedHeader("*");
        corsConfig.addAllowedMethod("*");
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        
        return new CorsWebFilter(source);
    }
}