package co.edu.unbosque.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import co.edu.unbosque.client.ProviderClient;

@Service
public class ValidationService {
    
    @Autowired
    private ProviderClient providerClient;
    
    public boolean validateProviderExists(Long providerNit) {
        try {
            return providerClient.existsByNit(providerNit);
        } catch (Exception e) {
            // Log del error
            System.err.println("Error validating provider: " + e.getMessage());
            return false;
        }
    }
}
