package co.edu.unbosque.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", url = "http://localhost:8086")
public interface UserClient {
    
    @GetMapping("/checkuser/{documentId}")
    boolean existsById(@PathVariable Long documentId);
}
