package co.edu.unbosque.model;



import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "sale")

public class Sale {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long codeSale;
	private Long idClient;
	private Long idUser;
	@Column
	private double ivaSale;
	private double totalSale;
	private double valueSale;
	
	
	public Sale() {
	} 
	
	

	public Sale(Long codeSale, Long idClient, Long idUser, double ivaSale, double totalSale, double valueSale) {
		super();
		this.codeSale = codeSale;
		this.idClient = idClient;
		this.idUser = idUser;
		this.ivaSale = ivaSale;
		this.totalSale = totalSale;
		this.valueSale = valueSale;
	}



	public Long getCodeSale() {
		return codeSale;
	}

	public void setCodeSale(Long codeSale) {
		this.codeSale = codeSale;
	}

	public Long getIdClient() {
		return idClient;
	}

	public void setIdClient(Long idClient) {
		this.idClient = idClient;
	}

	public Long getIdUser() {
		return idUser;
	}

	public void setIdUser(Long idUser) {
		this.idUser = idUser;
	}

	public double getIvaSale() {
		return ivaSale;
	}

	public void setIvaSale(double ivaSale) {
		this.ivaSale = ivaSale;
	}

	public double getTotalSale() {
		return totalSale;
	}

	public void setTotalSale(double totalSale) {
		this.totalSale = totalSale;
	}

	public double getValueSale() {
		return valueSale;
	}

	public void setValueSale(double valueSale) {
		this.valueSale = valueSale;
	}
}

