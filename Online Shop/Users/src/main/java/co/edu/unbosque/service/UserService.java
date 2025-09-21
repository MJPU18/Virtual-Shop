package co.edu.unbosque.service;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import co.edu.unbosque.model.User;
import co.edu.unbosque.repository.UserRepository;

@Service
public class UserService implements CRUDOperation<User>{
	
	@Autowired
	private UserRepository userRepo;
	
	public UserService() {
		// TODO Auto-generated constructor stub
	}

	@Override
	public int create(User data) {
		if (exist(data.getDocumentId())) {
			return 1;
		}
		else if(data.getDocumentId()<=0) {
			return 2;
		}
		else if(!isValidEmail(data.getEmail())) {
			return 3;
		}
		if(userRepo.existsByUserName(data.getUserName())) {
			return 4;
		}
		if(userRepo.existsByEmail(data.getEmail())) {
			return 5;
		}
		userRepo.save(data);
		return 0;
	}

	@Override
	public List<User> getAll() {
		return userRepo.findAll();
	}

	@Override
	public int deleteById(Long id) {
		Optional<User> found=userRepo.findByDocumentId(id);
		if(found.isPresent()) {
			userRepo.delete(found.get());
			return 0;
		}
		return 1;
	}

	@Override
	public int updateById(Long id, User newData) {
		Optional<User> found=userRepo.findByDocumentId(id);
		if(!isValidEmail(newData.getEmail())) {
			return 1;
		}
		if(found.isPresent()) {
			User temp=found.get();
			if(!temp.getUserName().equals(newData.getUserName())&&userRepo.existsByUserName(newData.getUserName())) {
				return 3;
			}
			if(!temp.getEmail().equals(newData.getEmail())&&userRepo.existsByEmail(newData.getEmail())) {
				return 4;
			}
			temp.setEmail(newData.getEmail());
			temp.setUserName(newData.getUserName());
			temp.setPassword(newData.getPassword());
			temp.setUsuario(newData.getUsuario());
			userRepo.save(temp);
			return 0;
		}
		return 2;
	}

	@Override
	public boolean exist(Long id) {
		return userRepo.existsById(id);
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
