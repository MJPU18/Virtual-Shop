package co.edu.unbosque.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import co.edu.unbosque.model.User;


public interface UserRepository extends JpaRepository<User, Long> {

	public Optional<User> findByDocumentId(Long documentId);
	public boolean existsByUserName(String userName);
	public boolean existsByEmail(String email);
	
}
