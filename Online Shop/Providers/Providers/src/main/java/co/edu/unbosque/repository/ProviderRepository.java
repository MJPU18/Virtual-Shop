package co.edu.unbosque.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.edu.unbosque.model.Provider;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long>{
}
