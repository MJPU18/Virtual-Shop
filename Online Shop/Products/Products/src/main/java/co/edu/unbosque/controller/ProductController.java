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
import co.edu.unbosque.model.Product;
import co.edu.unbosque.service.ProductService;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/product")
@CrossOrigin(origins = { "http://localhost:8084","*" })
@Transactional

public class ProductController {

	@Autowired
	private ProductService prodServ;

	
	public ProductController() {
	}
	@PostMapping(path = "/create", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> createProduct(@RequestBody Product newProduct){
		prodServ.create(newProduct);
		return new ResponseEntity<String>("Producto creado exitosamente.",HttpStatus.CREATED);
		
	}
	
    @PutMapping(path = "/update/{productCode}")
    public ResponseEntity<String> updateProduct(@PathVariable Long productCode, @RequestBody Product updatedProduct) {
        Product result = prodServ.updateByProductCode(productCode, updatedProduct);
        
        if (result != null) {
            return new ResponseEntity<>("Producto actualizado exitosamente.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Producto no encontrado.", HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping(path = "/list")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = prodServ.getAll();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
  
    
    @DeleteMapping("/delete/{productCode}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long productCode) {
        Product deletedProduct = prodServ.deleteByProductCode(productCode);
        
        if (deletedProduct != null) {
            return new ResponseEntity<>("Producto eliminado exitosamente.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Producto no encontrado.", HttpStatus.NOT_FOUND);
        }
    }
	
	
}
