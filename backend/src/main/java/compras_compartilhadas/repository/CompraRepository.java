package compras_compartilhadas.repository;

import compras_compartilhadas.model.Compra;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompraRepository extends JpaRepository<Compra, Integer> {

    List<Compra> findByItem_Lista_Grupo_Id(Integer grupoId);

    List<Compra> findByItem_Id(Integer itemId);
}