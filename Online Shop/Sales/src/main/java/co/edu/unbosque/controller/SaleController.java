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
    
    public record SaleDTO(Long codeSale, Long idClient, Long idUser, double ivaSale, double valueSale) {}

    
    @PostMapping(path = "/create", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createSale(@RequestBody SaleDTO newSale){
        
        if (!validationService.validateClientExists(newSale.idClient)) {
            return new ResponseEntity<String>("El cliente con ID " + newSale.idClient + " no existe.", 
                    HttpStatus.BAD_REQUEST);
        }
        
        if (!validationService.validateUserExists(newSale.idUser)) {
            return new ResponseEntity<String>("El usuario con ID " + newSale.idUser + " no existe.", 
                    HttpStatus.BAD_REQUEST);
        }
        
        if(newSale.ivaSale<0) {
        	return new ResponseEntity<String>("El iva debe ser un valor mayor a 0.", HttpStatus.BAD_REQUEST);
        }
        double calculate = newSale.valueSale + (newSale.ivaSale * newSale.valueSale / 100);
        Sale registerSale= new Sale((long)1, newSale.idClient, newSale.idUser, newSale.ivaSale, calculate, newSale.valueSale);
        registerSale.setCodeSale(null);
        saleServ.create(registerSale);
        return new ResponseEntity<String>("Venta creada exitosamente.", HttpStatus.CREATED);
    }
    
    @PutMapping(path = "/update/{codeSale}")
    public ResponseEntity<String> updateSale(@PathVariable Long codeSale, @RequestBody SaleDTO updatedSale) {
        
        if (!validationService.validateClientExists(updatedSale.idClient)) {
            return new ResponseEntity<String>("El cliente con ID " + updatedSale.idClient + " no existe.", 
                    HttpStatus.BAD_REQUEST);
        }
        
        if (!validationService.validateUserExists(updatedSale.idUser)) {
            return new ResponseEntity<String>("El usuario con ID " + updatedSale.idUser + " no existe.", 
                    HttpStatus.BAD_REQUEST);
        }
        
        
        if(updatedSale.ivaSale<0) {
        	return new ResponseEntity<String>("El iva debe ser un valor mayor a 0.", HttpStatus.BAD_REQUEST);
        }
        double calculate = updatedSale.valueSale + (updatedSale.ivaSale * updatedSale.valueSale / 100);
        Sale registerSale= new Sale((long)1, updatedSale.idClient, updatedSale.idUser, updatedSale.ivaSale, calculate, updatedSale.valueSale);
        
        Sale result = saleServ.updateByCodeSale(codeSale, registerSale);
        
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
