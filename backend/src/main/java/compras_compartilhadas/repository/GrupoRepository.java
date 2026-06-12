package compras_compartilhadas.repository;

import compras_compartilhadas.model.Grupo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface GrupoRepository extends JpaRepository<Grupo, Integer> {

    Optional<Grupo> findByCodigoConvite(String codigoConvite);

    boolean existsByCodigoConvite(String codigoConvite);
}