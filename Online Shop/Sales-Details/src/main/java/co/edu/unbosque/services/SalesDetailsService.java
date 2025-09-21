package co.edu.unbosque.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.edu.unbosque.model.SalesDetails;
import co.edu.unbosque.repository.SalesDetailsRepository;

@Service
public class SalesDetailsService {

	@Autowired
	private SalesDetailsRepository salesDetailsRepository;

	public SalesDetails create(SalesDetails salDet) {
		return salesDetailsRepository.save(salDet);
	}

	public int deleteSalesDetail(Long id) {
		Optional<SalesDetails> found = salesDetailsRepository.findById(id);
		if (found.isPresent()) {
			salesDetailsRepository.delete(found.get());
			return 0;
		} else {
			return 1;
		}

	}

	public int updateById(Long id, SalesDetails newSalesDetail) {
		Optional<SalesDetails> found = salesDetailsRepository.findById(id);
		if (found.isPresent()) {
			SalesDetails temp = found.get();
			temp.setProductQuantity(newSalesDetail.getProductQuantity());
			temp.setProductCode(newSalesDetail.getProductCode());
			temp.setSalesCode(newSalesDetail.getSalesCode());
			temp.setTotalValue(newSalesDetail.getTotalValue());
			temp.setSalesValue(newSalesDetail.getSalesValue());
			temp.setVatValue(newSalesDetail.getVatValue());
			return 0;
		}
		return 1;
	}

	public List<SalesDetails> getAll() {
		return salesDetailsRepository.findAll();
	}
}
