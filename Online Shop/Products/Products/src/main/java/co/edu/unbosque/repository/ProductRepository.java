package co.edu.unbosque.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.edu.unbosque.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>{
	
	public Optional<Product> findByProductCode(Long id);

}
