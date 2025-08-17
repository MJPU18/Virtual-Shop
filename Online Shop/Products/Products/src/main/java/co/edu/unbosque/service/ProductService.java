package co.edu.unbosque.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.edu.unbosque.model.Product;
import co.edu.unbosque.repository.ProductRepository;

@Service
public class ProductService implements CRUDOperation<Product>{
	
	@Autowired
	private ProductRepository prodRepo;
	
	public ProductService() {}

	@Override
	public Product create(Product data) {
		return prodRepo.save(data);	
	}
	

	@Override
	public List<Product> getAll() {
		return prodRepo.findAll();
	}

	@Override
	public Product deleteByProductCode(Long prodCod) {
		Optional<Product> found= prodRepo.findByProductCode(prodCod);
		if(found.isPresent()) {
			prodRepo.delete(found.get());
			return found.get();
		}
		return null;
	}

	@Override
	public Product updateByProductCode(Long id, Product newData) {
		Optional<Product> found = prodRepo.findByProductCode(id);
		if(found.isPresent()) {
			Product temp= found.get();
			temp.setIvaPurchase(newData.getIvaPurchase());
			temp.setProviderNit(newData.getProviderNit());
			temp.setProductName(newData.getProductName());
			temp.setPurchasePrice(newData.getPurchasePrice());
			temp.setSalePrice(newData.getSalePrice());
			return prodRepo.save(temp);
		}
		return null;
	}
	
	@Override
	public boolean exist(Long id) {
		return prodRepo.findByProductCode(id).isPresent();
	}
}