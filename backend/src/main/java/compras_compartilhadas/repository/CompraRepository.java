package compras_compartilhadas.repository;

import compras_compartilhadas.model.Compra;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompraRepository extends JpaRepository<Compra, Integer> {

}