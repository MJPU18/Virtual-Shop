package co.edu.unbosque.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "salesDetails")
public class SalesDetails {

	@Id
	private Long salesDetailCode;
	private int productQuantity;

	private Long productCode;
	private Long salesCode;
	private double totalValue;
	private double salesValue;
	private double vatValue;
	
	public SalesDetails() {}

	public SalesDetails(Long salesDetailCode, int productQuantity, Long productCode, Long salesCode, double totalValue,
			double salesValue, double vatValue) {
		super();
		this.salesDetailCode = salesDetailCode;
		this.productQuantity = productQuantity;
		this.productCode = productCode;
		this.salesCode = salesCode;
		this.totalValue = totalValue;
		this.salesValue = salesValue;
		this.vatValue = vatValue;
	}

	public Long getSalesDetailCode() {
		return salesDetailCode;
	}

	public void setSalesDetailCode(Long salesDetailCode) {
		this.salesDetailCode = salesDetailCode;
	}

	public int getProductQuantity() {
		return productQuantity;
	}

	public void setProductQuantity(int productQuantity) {
		this.productQuantity = productQuantity;
	}

	public Long getProductCode() {
		return productCode;
	}

	public void setProductCode(Long productCode) {
		this.productCode = productCode;
	}

	public Long getSalesCode() {
		return salesCode;
	}

	public void setSalesCode(Long salesCode) {
		this.salesCode = salesCode;
	}

	public double getTotalValue() {
		return totalValue;
	}

	public void setTotalValue(double totalValue) {
		this.totalValue = totalValue;
	}

	public double getSalesValue() {
		return salesValue;
	}

	public void setSalesValue(double salesValue) {
		this.salesValue = salesValue;
	}

	public double getVatValue() {
		return vatValue;
	}

	public void setVatValue(double vatValue) {
		this.vatValue = vatValue;
	}

}
