package compras_compartilhadas.repository;

import compras_compartilhadas.model.UsuarioGrupo;
import compras_compartilhadas.model.UsuarioGrupoId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioGrupoRepository
        extends JpaRepository<UsuarioGrupo, UsuarioGrupoId> {

    List<UsuarioGrupo> findByGrupo_Id(Integer grupoId);

    List<UsuarioGrupo> findByUsuario_Id(Integer usuarioId);

    Optional<UsuarioGrupo> findByUsuario_IdAndGrupo_Id(Integer usuarioId, Integer grupoId);

    boolean existsByUsuario_IdAndGrupo_Id(Integer usuarioId, Integer grupoId);
}