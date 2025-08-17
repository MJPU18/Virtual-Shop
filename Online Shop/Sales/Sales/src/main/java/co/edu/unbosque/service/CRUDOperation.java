package co.edu.unbosque.service;

import java.util.List;

public interface CRUDOperation<T> {
	
	public T create(T data);
	
	public T deleteByCodeSale(Long prodCod);
	
	public T updateByCodeSale(Long prodCod, T data);
	
	public List<T> getAll();
	
	public boolean exist(Long prodCod);

}