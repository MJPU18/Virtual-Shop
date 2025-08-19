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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import co.edu.unbosque.model.Product;
import co.edu.unbosque.service.ProductService;
import co.edu.unbosque.service.ValidationService;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/product")
@CrossOrigin(origins = { "http://localhost:8084","*" })
@Transactional
public class ProductController {

    @Autowired
    private ProductService prodServ;
    
    @Autowired
    private ValidationService validationService;

    public ProductController() {
    }
    
    @PostMapping(path = "/create", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createProduct(@RequestBody Product newProduct){
        
        // Validar que el proveedor existe
        if (!validationService.validateProviderExists(newProduct.getProviderNit())) {
            return new ResponseEntity<String>("El proveedor con NIT " + newProduct.getProviderNit() + " no existe.", 
                    HttpStatus.BAD_REQUEST);
        }
        newProduct.setProductCode(null);
        // Si la validación pasa, crear el producto
        prodServ.create(newProduct);
        return new ResponseEntity<String>("Producto creado exitosamente.", HttpStatus.CREATED);
    }
    
    @PutMapping(path = "/update/{productCode}")
    public ResponseEntity<String> updateProduct(@PathVariable Long productCode, @RequestBody Product updatedProduct) {
        
        // Validar que el proveedor existe
        if (!validationService.validateProviderExists(updatedProduct.getProviderNit())) {
            return new ResponseEntity<String>("El proveedor con NIT " + updatedProduct.getProviderNit() + " no existe.", 
                    HttpStatus.BAD_REQUEST);
        }
        
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
    
    @GetMapping(path = "/checkproduct/{productCode}")
    public ResponseEntity<Boolean> checkProductExists(@PathVariable Long productCode) {
        boolean exists = prodServ.exist(productCode);
        return new ResponseEntity<>(exists, HttpStatus.OK);
    }
    
    @GetMapping(path = "/checkproduct/iva")
    public ResponseEntity<Boolean> validateProductIva(@RequestParam Long productCode,
                                                     @RequestParam double ivaPurchase) {
        boolean isValid = prodServ.validateProductIva(productCode, ivaPurchase);
        return new ResponseEntity<>(isValid, HttpStatus.OK);
    }
}
