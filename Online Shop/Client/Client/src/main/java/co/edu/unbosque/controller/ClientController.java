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
import org.springframework.web.bind.annotation.RestController;

import co.edu.unbosque.model.Client;
import co.edu.unbosque.service.ClientService;
import jakarta.transaction.Transactional;

@RestController
@CrossOrigin(origins = { "http://localhost:8085","*"})
@Transactional
public class ClientController {
	
	@Autowired
	private ClientService clientServ;
	
	private record UpdateClient(String address, String email, String fullName, String phone){};
	
	public ClientController() {
		// TODO Auto-generated constructor stub
	}
	
	@PostMapping(path = "/create", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> create(@RequestBody Client client){
		int status=clientServ.create(client);
		if (status == 0) {
			return new ResponseEntity<String>("Client create successfully.", HttpStatus.CREATED);
		}
		if (status == 1) {
			return new ResponseEntity<String>("The document entered already exists, please try another one.",
					HttpStatus.NOT_ACCEPTABLE);
		}
		if (status == 3) {
			return new ResponseEntity<String>("Email invalid",HttpStatus.NOT_ACCEPTABLE);
		}
		return new ResponseEntity<String>("Please enter an document greater than 0.", HttpStatus.NOT_ACCEPTABLE);
	}
	
	@GetMapping(path = "/getall")
	public ResponseEntity<List<Client>> getAll(){
		List<Client> clients=clientServ.getAll();
		if (clients.isEmpty()) {
			return new ResponseEntity<List<Client>>(clients, HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<List<Client>>(clients, HttpStatus.OK);
	}
	
	@PutMapping(path = "/updatebydocumentid/{documentId}")
	public ResponseEntity<String> updateUserById(@PathVariable Long documentId,@RequestBody UpdateClient newClient){
		Client aux=new Client(documentId, newClient.address, newClient.email, newClient.fullName, newClient.phone);
		int status=clientServ.updateById(documentId, aux);
		if(status==0) {
			return new ResponseEntity<String>("Client successfully update.",HttpStatus.ACCEPTED);
		}
		else if(status==1) {
			return new ResponseEntity<String>("Email invalid.",HttpStatus.CONFLICT);
		}
		return new ResponseEntity<String>("Document not found.",HttpStatus.NOT_FOUND);
	}
	
	@DeleteMapping(path = "/deletebydocumentid/{documentId}")
	public ResponseEntity<String> deleteById(@PathVariable Long documentId){
		int status=clientServ.deleteById(documentId);
		if(status==0) {
			return new ResponseEntity<String>("Client deleted successfully.",HttpStatus.ACCEPTED);
		}
		return new ResponseEntity<String>("Document not found.",HttpStatus.NOT_FOUND);
	}

}
