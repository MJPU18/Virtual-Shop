package co.edu.unbosque.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "client-service")
public interface ClientClient {
    
    @GetMapping("/checkclient/{documentId}")
    boolean existsById(@PathVariable Long documentId);
}
