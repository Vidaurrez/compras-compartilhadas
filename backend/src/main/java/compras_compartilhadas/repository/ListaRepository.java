package compras_compartilhadas.repository;

import compras_compartilhadas.model.Lista;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ListaRepository extends JpaRepository<Lista, Integer> {

    List<Lista> findByGrupo_Id(Integer grupoId);
}