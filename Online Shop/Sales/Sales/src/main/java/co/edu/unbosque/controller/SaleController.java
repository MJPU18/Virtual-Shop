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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import co.edu.unbosque.model.Sale;
import co.edu.unbosque.service.SaleService;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/sale")
@CrossOrigin(origins = { "http://localhost:8082","*" })
@Transactional
public class SaleController {

	@Autowired
	private SaleService saleServ;

	
	public SaleController() {
	}
	
	@PostMapping(path = "/create", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> createSale(@RequestBody Sale newSale){
		newSale.setCodeSale(null);
		saleServ.create(newSale);
		return new ResponseEntity<String>("Producto creado exitosamente.",HttpStatus.CREATED);
		
	}
	
    @PutMapping(path = "/update/{codeSale}")
    public ResponseEntity<String> updateSale(@PathVariable Long codeSale, @RequestBody Sale updatedSale) {
    	Sale result = saleServ.updateByCodeSale(codeSale, updatedSale);
        
        if (result != null) {
            return new ResponseEntity<>("Venta actualizada exitosamente.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Venta no encontrada.", HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping(path = "/list")
    public ResponseEntity<List<Sale>> getAllSales() {
        List<Sale> products = saleServ.getAll();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
  
    
    @DeleteMapping(path = "/delete/{codeSale}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long codeSale) {
    	Sale deletedSale = saleServ.deleteByCodeSale(codeSale);
        
        if (deletedSale != null) {
            return new ResponseEntity<>("Producto eliminado exitosamente.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Producto no encontrado.", HttpStatus.NOT_FOUND);
        }
    }
	
	
}
