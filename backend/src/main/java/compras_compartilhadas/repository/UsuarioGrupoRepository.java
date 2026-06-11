package compras_compartilhadas.repository;

import compras_compartilhadas.model.UsuarioGrupo;
import compras_compartilhadas.model.UsuarioGrupoId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsuarioGrupoRepository
        extends JpaRepository<UsuarioGrupo, UsuarioGrupoId> {

    List<UsuarioGrupo> findByGrupoId(Integer grupoId);
}