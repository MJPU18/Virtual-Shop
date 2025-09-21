package co.edu.unbosque.service;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import co.edu.unbosque.model.Client;
import co.edu.unbosque.repository.ClientRepository;

@Service
public class ClientService implements CRUDOperation<Client>{
	
	@Autowired
	private ClientRepository clientRepo;
	
	public ClientService() {
		// TODO Auto-generated constructor stub
	}

	@Override
	public int create(Client data) {
		if (exist(data.getDocumentId())) {
			return 1;
		}
		else if(data.getDocumentId()<=0) {
			return 2;
		}
		else if(!isValidEmail(data.getEmail())) {
			return 3;
		}
		clientRepo.save(data);
		return 0;
	}

	@Override
	public List<Client> getAll() {
		return clientRepo.findAll();
	}

	@Override
	public int deleteById(Long id) {
		Optional<Client> found=clientRepo.findByDocumentId(id);
		if(found.isPresent()) {
			clientRepo.delete(found.get());
			return 0;
		}
		return 1;
	}

	@Override
	public int updateById(Long id, Client newData) {
		Optional<Client> found=clientRepo.findByDocumentId(id);
		if(!isValidEmail(newData.getEmail())) {
			return 1;
		}
		if(found.isPresent()) {
			Client temp=found.get();
			temp.setFullName(newData.getFullName());
			temp.setAddress(newData.getAddress());
			temp.setPhone(newData.getPhone());
			clientRepo.save(temp);
			return 0;
		}
		return 2;
	}

	@Override
	public boolean exist(Long id) {
		return clientRepo.existsById(id);
	}
	
	public static boolean isValidEmail(String email) {
        String regex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        Pattern pattern = Pattern.compile(regex);
        if (email == null) {
            return false;
        }
        return pattern.matcher(email).matches();
    }

}
