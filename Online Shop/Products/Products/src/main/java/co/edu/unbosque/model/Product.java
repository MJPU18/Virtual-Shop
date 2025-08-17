package co.edu.unbosque.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_aeb")

public class Product {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long productCode;
	@Column
	private double ivaPurchase;
	private long providerNit;
	private String productName;
	private double purchasePrice;
	private double salePrice;
	
	public Product() {
	}
	
	public Product(long productCode, double ivaPurchase, long providerNit, String productName, double purchasePrice,
			double salePrice) {
		super();
		this.productCode = productCode;
		this.ivaPurchase = ivaPurchase;
		this.providerNit = providerNit;
		this.productName = productName;
		this.purchasePrice = purchasePrice;
		this.salePrice = salePrice;
	}

	public Long getProductCode() {
		return productCode;
	}

	public void setProductCode(Long productCode) {
		this.productCode = productCode;
	}

	public double getIvaPurchase() {
		return ivaPurchase;
	}

	public void setIvaPurchase(double ivaPurchase) {
		this.ivaPurchase = ivaPurchase;
	}

	public long getProviderNit() {
		return providerNit;
	}

	public void setProviderNit(long providerNit) {
		this.providerNit = providerNit;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public double getPurchasePrice() {
		return purchasePrice;
	}

	public void setPurchasePrice(double purchasePrice) {
		this.purchasePrice = purchasePrice;
	}

	public double getSalePrice() {
		return salePrice;
	}

	public void setSalePrice(double salePrice) {
		this.salePrice = salePrice;
	}

}