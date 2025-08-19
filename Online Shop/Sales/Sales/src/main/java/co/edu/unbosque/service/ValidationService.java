package co.edu.unbosque.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import co.edu.unbosque.client.UserClient;
import co.edu.unbosque.client.ClientClient;

@Service
public class ValidationService {
    
    @Autowired
    private UserClient userClient;
    
    @Autowired
    private ClientClient clientClient;
    
    public boolean validateUserExists(Long userId) {
        try {
            return userClient.existsById(userId);
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean validateClientExists(Long clientId) {
        try {
            return clientClient.existsById(clientId);
        } catch (Exception e) {
            return false;
        }
    }
}