package co.edu.unbosque.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import co.edu.unbosque.client.SaleClient;
import co.edu.unbosque.client.ProductClient;

@Service
public class ValidationService {
    
    @Autowired
    private SaleClient saleClient;
    
    @Autowired
    private ProductClient productClient;
    
    public boolean validateSaleExists(Long salesCode) {
        try {
        	System.out.println(saleClient.existsByCode(salesCode));
            return saleClient.existsByCode(salesCode);
        } catch (Exception e) {
            System.err.println("Error validating sale: " + e.getMessage());
            return false;
        }
    }
    
    public boolean validateSaleValues(Long salesCode, double salesValue, double totalValue) {
        try {
        	System.out.println(saleClient.validateSaleValues(salesCode, salesValue, totalValue));
            return saleClient.validateSaleValues(salesCode, salesValue, totalValue);
        } catch (Exception e) {
            System.err.println("Error validating sale values: " + e.getMessage());
            return false;
        }
    }
    
    public boolean validateProductExists(Long productCode) {
        try {
        	System.out.println(productClient.existsByCode(productCode));
            return productClient.existsByCode(productCode);
        } catch (Exception e) {
            System.err.println("Error validating product: " + e.getMessage());
            return false;
        }
    }
    
}
