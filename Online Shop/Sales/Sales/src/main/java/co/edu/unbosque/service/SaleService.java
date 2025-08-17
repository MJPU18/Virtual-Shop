package co.edu.unbosque.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.edu.unbosque.model.Sale;
import co.edu.unbosque.repository.SaleRepository;

@Service
public class SaleService implements CRUDOperation<Sale>{
	
	@Autowired
	private SaleRepository saleRepo;
	
	public SaleService() {}

	@Override
	public Sale create(Sale data) {
		return saleRepo.save(data);	
	}
	

	@Override
	public List<Sale> getAll() {
		return saleRepo.findAll();
	}

	@Override
	public Sale deleteByCodeSale(Long prodCod) {
		Optional<Sale> found= saleRepo.findByCodeSale(prodCod);
		if(found.isPresent()) {
			saleRepo.delete(found.get());
			return found.get();
		}
		return null;
	}

	@Override
	public Sale updateByCodeSale(Long id, Sale newData) {
		Optional<Sale> found = saleRepo.findByCodeSale(id);
		if(found.isPresent()) {
			Sale temp= found.get();
			temp.setIvaSale(newData.getIvaSale());
			temp.setTotalSale(newData.getTotalSale());
			temp.setValueSale(newData.getValueSale());
			return saleRepo.save(temp);
		}
		return null;
	}
	
	@Override
	public boolean exist(Long id) {
		return saleRepo.findByCodeSale(id).isPresent();
	}
}