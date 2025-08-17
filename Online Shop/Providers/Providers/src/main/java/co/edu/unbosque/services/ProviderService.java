package co.edu.unbosque.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.edu.unbosque.model.Provider;
import co.edu.unbosque.repository.ProviderRepository;

@Service
public class ProviderService {

	@Autowired
	private ProviderRepository providerRepository;

	public Provider create(Provider prov) {
		return providerRepository.save(prov);
	}

	public int deleteProvider(Long id) {
		Optional<Provider> found = providerRepository.findById(id);
		if (found.isPresent()) {
			providerRepository.delete(found.get());
			return 0;
		} else {
			return 1;
		}
	}
	
	public int updateById(Long id, Provider newProvider) {
		Optional<Provider> found = providerRepository.findById(id);
		if(found.isPresent()) {
			Provider temp = found.get();
			temp.setProviderCity(newProvider.getProviderCity());
			temp.setProviderAddress(newProvider.getProviderAddress());
			temp.setProviderName(newProvider.getProviderName());
			temp.setProviderPhone(newProvider.getProviderPhone());
			return 0;
		}
		return 1;
	}
	
	public List<Provider> getAll(){
		return providerRepository.findAll();
	}

}
