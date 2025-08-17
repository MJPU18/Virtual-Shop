package co.edu.unbosque.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "providers")
public class Provider {

	@Id
	private Long nitprovider;

	@Column
	private String providerCity;
	private String providerAddress;
	private String providerName;
	private Long providerPhone;

	public Provider() {
	}

	public Provider(Long nitprovider, String providerCity, String providerAddress, String providerName,
			Long providerPhone) {
		super();
		this.nitprovider = nitprovider;
		this.providerCity = providerCity;
		this.providerAddress = providerAddress;
		this.providerName = providerName;
		this.providerPhone = providerPhone;
	}

	public Long getNitprovider() {
		return nitprovider;
	}

	public void setNitprovider(Long nitprovider) {
		this.nitprovider = nitprovider;
	}

	public String getProviderCity() {
		return providerCity;
	}

	public void setProviderCity(String providerCity) {
		this.providerCity = providerCity;
	}

	public String getProviderAddress() {
		return providerAddress;
	}

	public void setProviderAddress(String providerAddress) {
		this.providerAddress = providerAddress;
	}

	public String getProviderName() {
		return providerName;
	}

	public void setProviderName(String providerName) {
		this.providerName = providerName;
	}

	public Long getProviderPhone() {
		return providerPhone;
	}

	public void setProviderPhone(Long providerPhone) {
		this.providerPhone = providerPhone;
	}

}
