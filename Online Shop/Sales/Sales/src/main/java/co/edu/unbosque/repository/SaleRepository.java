package co.edu.unbosque.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.edu.unbosque.model.Sale;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long>{
	
	public Optional<Sale> findByCodeSale(Long id);

}
