package co.edu.unbosque.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.edu.unbosque.model.SalesDetails;

@Repository
public interface SalesDetailsRepository extends JpaRepository<SalesDetails, Long>{
}
