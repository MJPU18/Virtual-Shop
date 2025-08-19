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
            return saleClient.existsByCode(salesCode);
        } catch (Exception e) {
            System.err.println("Error validating sale: " + e.getMessage());
            return false;
        }
    }
    
    public boolean validateSaleValues(Long salesCode, double salesValue, double totalValue) {
        try {
            return saleClient.validateSaleValues(salesCode, salesValue, totalValue);
        } catch (Exception e) {
            System.err.println("Error validating sale values: " + e.getMessage());
            return false;
        }
    }
    
    public boolean validateProductExists(Long productCode) {
        try {
            return productClient.existsByCode(productCode);
        } catch (Exception e) {
            System.err.println("Error validating product: " + e.getMessage());
            return false;
        }
    }
    
    public boolean validateProductIva(Long productCode, double ivaPurchase) {
        try {
            return productClient.validateProductIva(productCode, ivaPurchase);
        } catch (Exception e) {
            System.err.println("Error validating product IVA: " + e.getMessage());
            return false;
        }
    }
}
