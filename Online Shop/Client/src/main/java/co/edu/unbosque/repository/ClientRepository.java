package co.edu.unbosque.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import co.edu.unbosque.model.Client;

public interface ClientRepository extends JpaRepository<Client, Long> {
	
	public Optional<Client> findByDocumentId(Long documentId);

}
