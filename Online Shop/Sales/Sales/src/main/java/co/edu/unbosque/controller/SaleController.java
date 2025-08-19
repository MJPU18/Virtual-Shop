package co.edu.unbosque.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import co.edu.unbosque.model.Sale;
import co.edu.unbosque.service.SaleService;
import co.edu.unbosque.service.ValidationService;
import jakarta.transaction.Transactional;

@RestController
@CrossOrigin(origins = { "http://localhost:8082","*" })
@Transactional
public class SaleController {

    @Autowired
    private SaleService saleServ;
    
    @Autowired
    private ValidationService validationService;

    public SaleController() {
    }
    
    @PostMapping(path = "/create", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createSale(@RequestBody Sale newSale){
        
        // Validar que el cliente existe
        if (!validationService.validateClientExists(newSale.getIdClient())) {
            return new ResponseEntity<String>("El cliente con ID " + newSale.getIdClient() + " no existe.", 
                    HttpStatus.BAD_REQUEST);
        }
        
        // Validar que el usuario existe
        if (!validationService.validateUserExists(newSale.getIdUser())) {
            return new ResponseEntity<String>("El usuario con ID " + newSale.getIdUser() + " no existe.", 
                    HttpStatus.BAD_REQUEST);
        }
        
        // Si ambas validaciones pasan, crear la venta
        newSale.setCodeSale(null);
        saleServ.create(newSale);
        return new ResponseEntity<String>("Venta creada exitosamente.", HttpStatus.CREATED);
    }
    
    @PutMapping(path = "/update/{codeSale}")
    public ResponseEntity<String> updateSale(@PathVariable Long codeSale, @RequestBody Sale updatedSale) {
        
        // Validar que el cliente existe
        if (!validationService.validateClientExists(updatedSale.getIdClient())) {
            return new ResponseEntity<String>("El cliente con ID " + updatedSale.getIdClient() + " no existe.", 
                    HttpStatus.BAD_REQUEST);
        }
        
        // Validar que el usuario existe
        if (!validationService.validateUserExists(updatedSale.getIdUser())) {
            return new ResponseEntity<String>("El usuario con ID " + updatedSale.getIdUser() + " no existe.", 
                    HttpStatus.BAD_REQUEST);
        }
        
        Sale result = saleServ.updateByCodeSale(codeSale, updatedSale);
        
        if (result != null) {
            return new ResponseEntity<>("Venta actualizada exitosamente.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Venta no encontrada.", HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping(path = "/list")
    public ResponseEntity<List<Sale>> getAllSales() {
        List<Sale> sales = saleServ.getAll();
        return new ResponseEntity<>(sales, HttpStatus.OK);
    }
    
    @DeleteMapping(path = "/delete/{codeSale}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long codeSale) {
        Sale deletedSale = saleServ.deleteByCodeSale(codeSale);
        
        if (deletedSale != null) {
            return new ResponseEntity<>("Venta eliminada exitosamente.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Venta no encontrada.", HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping(path = "/checksale/{codeSale}")
    public ResponseEntity<Boolean> checkSaleExists(@PathVariable Long codeSale) {
        boolean exists = saleServ.exist(codeSale);
        return new ResponseEntity<>(exists, HttpStatus.OK);
    }
    
    @GetMapping(path = "/checksale/values")
    public ResponseEntity<Boolean> validateSaleValues(@RequestParam Long codeSale,
                                                     @RequestParam double valueSale,
                                                     @RequestParam double totalSale) {
        boolean isValid = saleServ.validateSaleValues(codeSale, valueSale, totalSale);
        return new ResponseEntity<>(isValid, HttpStatus.OK);
    }
    
}
