package co.edu.unbosque.service;

import java.util.List;

public interface CRUDOperation<T> {
	
	public T create(T data);
	
	public T deleteByProductCode(Long prodCod);
	
	public T updateByProductCode(Long prodCod, T data);
	
	public List<T> getAll();
	
	public boolean exist(Long prodCod);

}