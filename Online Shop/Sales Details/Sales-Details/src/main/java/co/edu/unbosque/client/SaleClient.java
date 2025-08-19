package co.edu.unbosque.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "sale-service", url = "http://localhost:8082")
public interface SaleClient {
    
    @GetMapping("/checksale/{codeSale}")
    boolean existsByCode(@PathVariable Long codeSale);
    
    @GetMapping("/checksale/values")
    boolean validateSaleValues(@RequestParam Long codeSale, 
                              @RequestParam double valueSale, 
                              @RequestParam double totalSale);
}