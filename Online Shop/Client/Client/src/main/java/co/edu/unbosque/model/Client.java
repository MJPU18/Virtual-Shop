package co.edu.unbosque.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "client_vs")
public class Client {

	@Id
	private Long documentId;
	private String address;
	private String email;
	private String fullName;
	private String phone;
	
	public Client() {
		// TODO Auto-generated constructor stub
	}

	public Client(Long documentId, String address, String email, String fullName, String phone) {
		super();
		this.documentId = documentId;
		this.address = address;
		this.email = email;
		this.fullName = fullName;
		this.phone = phone;
	}

	public Long getDocumentId() {
		return documentId;
	}

	public void setDocumentId(Long documentId) {
		this.documentId = documentId;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

}
