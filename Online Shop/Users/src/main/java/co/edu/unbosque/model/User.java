package co.edu.unbosque.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_vs")
public class User {

	@Id
	private Long documentId;
	private String email;
	private String userName;
	private String password;
	private String usuario;
	
	public User() {
		// TODO Auto-generated constructor stub
	}
	
	public User(Long documentId, String email, String userName, String password, String usuario) {
		super();
		this.documentId = documentId;
		this.email = email;
		this.userName = userName;
		this.password = password;
		this.usuario = usuario;
	}



	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getUsuario() {
		return usuario;
	}

	public void setUsuario(String usuario) {
		this.usuario = usuario;
	}

	public Long getDocumentId() {
		return documentId;
	}

	public void setDocumentId(Long documentId) {
		this.documentId = documentId;
	}


}