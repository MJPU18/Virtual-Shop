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

import co.edu.unbosque.model.SalesDetails;
import co.edu.unbosque.services.SalesDetailsService;
import co.edu.unbosque.services.ValidationService;
import jakarta.transaction.Transactional;

@RestController
@CrossOrigin(origins = { "http://localhost:8081", "*" })
@Transactional
public class SalesDetailsController {

    @Autowired
    private SalesDetailsService salesDetailsService;
    
    @Autowired
    private ValidationService validationService;

    private record UpdateSalesDetail(int productQuantity, Long productCode, Long salesCode, double totalValue,
            double salesValue, double vatValue) {
    }

    @PostMapping(path = "/save", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveSaleDetail(@RequestBody SalesDetails salesDetail) {
        
        // Validar que la venta existe
        if (!validationService.validateSaleExists(salesDetail.getSalesCode())) {
            return new ResponseEntity<String>("La venta con código " + salesDetail.getSalesCode() + " no existe.", 
                    HttpStatus.BAD_REQUEST);
        }
        
        // Validar valores de la venta
        if (!validationService.validateSaleValues(salesDetail.getSalesCode(), 
                                                 salesDetail.getSalesValue(), 
                                                 salesDetail.getTotalValue())) {
            return new ResponseEntity<String>("Los valores de venta no coinciden con los registrados para la venta " 
                    + salesDetail.getSalesCode() + ".", HttpStatus.BAD_REQUEST);
        }
        
        // Validar que el producto existe
        if (!validationService.validateProductExists(salesDetail.getProductCode())) {
            return new ResponseEntity<String>("El producto con código " + salesDetail.getProductCode() + " no existe.", 
                    HttpStatus.BAD_REQUEST);
        }
        
        // Validar IVA del producto (calcular a partir del vatValue)
        double calculatedIvaPurchase = salesDetail.getVatValue() / salesDetail.getSalesValue();
        if (!validationService.validateProductIva(salesDetail.getProductCode(), calculatedIvaPurchase)) {
            return new ResponseEntity<String>("El IVA no coincide con el registrado para el producto " 
                    + salesDetail.getProductCode() + ".", HttpStatus.BAD_REQUEST);
        }
        
        // Si todas las validaciones pasan, crear el detalle de venta
        salesDetailsService.create(salesDetail);
        return new ResponseEntity<String>("Detalle de venta creado exitosamente.", HttpStatus.CREATED);
    }

    @PutMapping(path = "update/{id}")
    public ResponseEntity<String> updateSalesDetail(@PathVariable Long id,
            @RequestBody UpdateSalesDetail newSalesDetail) {
        
        // Validar que la venta existe
        if (!validationService.validateSaleExists(newSalesDetail.salesCode)) {
            return new ResponseEntity<String>("La venta con código " + newSalesDetail.salesCode + " no existe.", 
                    HttpStatus.BAD_REQUEST);
        }
        
        // Validar valores de la venta
        if (!validationService.validateSaleValues(newSalesDetail.salesCode, 
                                                 newSalesDetail.salesValue, 
                                                 newSalesDetail.totalValue)) {
            return new ResponseEntity<String>("Los valores de venta no coinciden con los registrados para la venta " 
                    + newSalesDetail.salesCode + ".", HttpStatus.BAD_REQUEST);
        }
        
        // Validar que el producto existe
        if (!validationService.validateProductExists(newSalesDetail.productCode)) {
            return new ResponseEntity<String>("El producto con código " + newSalesDetail.productCode + " no existe.", 
                    HttpStatus.BAD_REQUEST);
        }
        
        // Validar IVA del producto
        double calculatedIvaPurchase = newSalesDetail.vatValue / newSalesDetail.salesValue;
        if (!validationService.validateProductIva(newSalesDetail.productCode, calculatedIvaPurchase)) {
            return new ResponseEntity<String>("El IVA no coincide con el registrado para el producto " 
                    + newSalesDetail.productCode + ".", HttpStatus.BAD_REQUEST);
        }
        
        SalesDetails aux = new SalesDetails(id, newSalesDetail.productQuantity, newSalesDetail.productCode,
                newSalesDetail.salesCode, newSalesDetail.totalValue, newSalesDetail.salesValue,
                newSalesDetail.vatValue);
        int status = salesDetailsService.updateById(id, aux);
        if (status == 0) {
            return new ResponseEntity<String>("Detalle de venta actualizado exitosamente.", HttpStatus.ACCEPTED);
        }
        return new ResponseEntity<String>("Error. Detalle de venta no encontrado.", HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> deleteSalesDetail(@PathVariable Long id) {
        int status = salesDetailsService.deleteSalesDetail(id);
        if (status == 0) {
            return new ResponseEntity<String>("Detalle de venta eliminado.", HttpStatus.ACCEPTED);
        }
        return new ResponseEntity<String>("Error. Detalle de venta no encontrado.", HttpStatus.NOT_FOUND);
    }
    
    @GetMapping(path = "/list")
    public ResponseEntity<List<SalesDetails>> listSalesDetail(){
        return ResponseEntity.ok(salesDetailsService.getAll());
    }
}