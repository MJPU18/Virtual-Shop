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

import co.edu.unbosque.model.User;
import co.edu.unbosque.service.UserService;
import jakarta.transaction.Transactional;

@RestController
@CrossOrigin(origins = { "http://localhost:8080","*"})
@Transactional
public class UserController {
	
	@Autowired
	private UserService userServ;
	
	private record UpdateUser( String email, String userName, String password, String usuario){};
	
	public UserController() {
		// TODO Auto-generated constructor stub
	}
	
	@PostMapping(path = "/create", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> create(@RequestBody User user){
		int status=userServ.create(user);
		if (status == 0) {
			return new ResponseEntity<String>("User create successfully.", HttpStatus.CREATED);
		}
		if (status == 1) {
			return new ResponseEntity<String>("The document entered already exists, please try another one.",
					HttpStatus.NOT_ACCEPTABLE);
		}
		if (status == 3) {
			return new ResponseEntity<String>("Email invalid",HttpStatus.NOT_ACCEPTABLE);
		}
		if (status == 4) {
			return new ResponseEntity<String>("The username entered already exists, please try another one.",
					HttpStatus.NOT_ACCEPTABLE);
		}
		if (status == 5) {
			return new ResponseEntity<String>("The email entered already exists, please try another one.",
					HttpStatus.NOT_ACCEPTABLE);
		}
		return new ResponseEntity<String>("Please enter an document greater than 0.", HttpStatus.NOT_ACCEPTABLE);
	}
	
	@GetMapping(path = "/getall")
	public ResponseEntity<List<User>> getAll(){
		List<User> users=userServ.getAll();
		if (users.isEmpty()) {
			return new ResponseEntity<List<User>>(users, HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<List<User>>(users, HttpStatus.OK);
	}
	
	@PutMapping(path = "/updatebydocumentid/{documentId}")
	public ResponseEntity<String> updateUserById(@PathVariable Long documentId,@RequestBody UpdateUser newUser){
		User aux=new User(documentId,  newUser.email,  newUser.userName,  newUser.password,  newUser.usuario);
		int status=userServ.updateById(documentId, aux);
		if(status==0) {
			return new ResponseEntity<String>("User successfully update.",HttpStatus.ACCEPTED);
		}
		else if(status==1) {
			return new ResponseEntity<String>("Email invalid.",HttpStatus.CONFLICT);
		}
		if (status == 3) {
			return new ResponseEntity<String>("The username entered already exists, please try another one.",
					HttpStatus.NOT_ACCEPTABLE);
		}
		if (status == 4) {
			return new ResponseEntity<String>("The email entered already exists, please try another one.",
					HttpStatus.NOT_ACCEPTABLE);
		}
		return new ResponseEntity<String>("Document not found.",HttpStatus.NOT_FOUND);
	}
	
	@DeleteMapping(path = "/deletebydocumentid/{documentId}")
	public ResponseEntity<String> deleteById(@PathVariable Long documentId){
		int status=userServ.deleteById(documentId);
		if(status==0) {
			return new ResponseEntity<String>("User deleted successfully.",HttpStatus.ACCEPTED);
		}
		return new ResponseEntity<String>("Document not found.",HttpStatus.NOT_FOUND);
	}

}
