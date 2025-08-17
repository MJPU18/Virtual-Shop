package co.edu.unbosque.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.edu.unbosque.model.Provider;
import co.edu.unbosque.services.ProviderService;
import jakarta.transaction.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/provider")
@CrossOrigin(origins = {"http://localhost:8083", "*" })
@Transactional
public class ProviderController {

	@Autowired
	private ProviderService providerService;
	
	private record UpdateProvider(String provider_city, String provider_address, String provider_name,Long provider_phone){}

	public ProviderController() {
	}

	@PostMapping(path = "/save", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> saveProvider(@RequestBody Provider provider) {
		providerService.create(provider);
		return new ResponseEntity<String>("Provider created.", HttpStatus.CREATED);
	}

	@DeleteMapping("delete/{id}")
	public ResponseEntity<String> deleteProvider(@PathVariable Long id) {
		int status = providerService.deleteProvider(id);
		if (status == 0) {
			return new ResponseEntity<String>("Provider deleted", HttpStatus.ACCEPTED);
		}
		return new ResponseEntity<String>("Error. Provider not found", HttpStatus.NOT_FOUND);
	}

	@PutMapping(path = "update/{id}")
	public ResponseEntity<String> updateProvider(@PathVariable Long id, @RequestBody UpdateProvider newProvider) {
		Provider aux = new Provider((long) 1, newProvider.provider_city, newProvider.provider_address, newProvider.provider_name, newProvider.provider_phone);
		int status = providerService.updateById(id, aux);
		if (status == 0) {
			return new ResponseEntity<String>("Provider updated", HttpStatus.ACCEPTED);
		}
		return new ResponseEntity<String>("Error. Provider not found", HttpStatus.NOT_FOUND);
	}
	
	@GetMapping(path = "/list")
	public ResponseEntity<List<Provider>> listProviders(){
		return ResponseEntity.ok(providerService.getAll());
	} 
}
