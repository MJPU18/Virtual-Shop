package co.edu.unbosque.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "provider-service")
public interface ProviderClient {
    
    @GetMapping("/checkprovider/{nitprovider}")
    boolean existsByNit(@PathVariable Long nitprovider);
}
