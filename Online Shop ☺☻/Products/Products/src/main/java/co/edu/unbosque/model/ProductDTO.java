package co.edu.unbosque.model;

public class ProductDTO {
	private long productCode;
	private double ivaPurchase;
	private long providerNit;
	private String productName;
	private double purchasePrice;
	private double salePrice;
	
	public ProductDTO(long productCode, double ivaPurchase, long providerNit, String productName, double purchasePrice,
			double salePrice) {
		super();
		this.productCode = productCode;
		this.ivaPurchase = ivaPurchase;
		this.providerNit = providerNit;
		this.productName = productName;
		this.purchasePrice = purchasePrice;
		this.salePrice = salePrice;
	}

	public long getProductCode() {
		return productCode;
	}

	public void setProductCode(long productCode) {
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
