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
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/salesDetails")
@CrossOrigin(origins = { "http://localhost:8081", "*" })
@Transactional
public class SalesDetailsController {

	@Autowired
	private SalesDetailsService salesDetailsService;

	private record UpdateSalesDetail(int productQuantity, Long productCode, Long salesCode, double totalValue,
			double salesValue, double vatValue) {
	}

	@PostMapping(path = "/save", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> saveSaleDetail(@RequestBody SalesDetails salesDetail) {
		salesDetailsService.create(salesDetail);
		return new ResponseEntity<String>("Sales detail created.", HttpStatus.CREATED);
	}

	@DeleteMapping("delete/{id}")
	public ResponseEntity<String> deleteSalesDetail(@PathVariable Long id) {
		int status = salesDetailsService.deleteSalesDetail(id);
		if (status == 0) {
			return new ResponseEntity<String>("Sales detail deleted", HttpStatus.ACCEPTED);
		}
		return new ResponseEntity<String>("Error. Sales detail not found", HttpStatus.NOT_FOUND);
	}

	@PutMapping(path = "update/{id}")
	public ResponseEntity<String> updateSalesDetail(@PathVariable Long id,
			@RequestBody UpdateSalesDetail newSalesDetail) {
		SalesDetails aux = new SalesDetails((long) 1, newSalesDetail.productQuantity, newSalesDetail.productCode,
				newSalesDetail.salesCode, newSalesDetail.totalValue, newSalesDetail.salesValue,
				newSalesDetail.vatValue);
		int status = salesDetailsService.updateById(id, aux);
		if (status == 0) {
			return new ResponseEntity<String>("Sales detail updated", HttpStatus.ACCEPTED);
		}
		return new ResponseEntity<String>("Error. Sales detail not found", HttpStatus.NOT_FOUND);
	}
	
	@GetMapping(path = "/list")
	public ResponseEntity<List<SalesDetails>> listSalesDetail(){
		return ResponseEntity.ok(salesDetailsService.getAll());
	}
}
