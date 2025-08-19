package co.edu.unbosque.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "product-service", url = "http://localhost:8084")
public interface ProductClient {
    
    @GetMapping("/product/checkproduct/{productCode}")
    boolean existsByCode(@PathVariable Long productCode);
    
    @GetMapping("/product/checkproduct/iva")
    boolean validateProductIva(@RequestParam Long productCode, 
                              @RequestParam double ivaPurchase);
}
