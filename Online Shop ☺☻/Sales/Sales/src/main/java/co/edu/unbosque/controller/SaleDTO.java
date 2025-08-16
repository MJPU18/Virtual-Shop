package co.edu.unbosque.controller;

public class SaleDTO {
	private long saleCode;
	private long clientId;
	private long userId;
	private double ivaSale;
	private double totalSale;
	private double saleValue;
	
	public SaleDTO(long saleCode, long clientId, long userId, double ivaSale, double totalSale, double saleValue) {
		super();
		this.saleCode = saleCode;
		this.clientId = clientId;
		this.userId = userId;
		this.ivaSale = ivaSale;
		this.totalSale = totalSale;
		this.saleValue = saleValue;
	}

	public long getSaleCode() {
		return saleCode;
	}

	public void setSaleCode(long saleCode) {
		this.saleCode = saleCode;
	}

	public long getClientId() {
		return clientId;
	}

	public void setClientId(long clientId) {
		this.clientId = clientId;
	}

	public long getUserId() {
		return userId;
	}

	public void setUserId(long userId) {
		this.userId = userId;
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

	public double getSaleValue() {
		return saleValue;
	}

	public void setSaleValue(double saleValue) {
		this.saleValue = saleValue;
	}

}
