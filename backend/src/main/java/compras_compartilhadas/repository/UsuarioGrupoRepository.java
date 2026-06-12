package compras_compartilhadas.repository;

import compras_compartilhadas.model.UsuarioGrupo;
import compras_compartilhadas.model.UsuarioGrupoId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsuarioGrupoRepository
        extends JpaRepository<UsuarioGrupo, UsuarioGrupoId> {

    List<UsuarioGrupo> findByGrupo_Id(Integer grupoId);

    List<UsuarioGrupo> findByUsuario_Id(Integer usuarioId);

    boolean existsByUsuario_IdAndGrupo_Id(Integer usuarioId, Integer grupoId);
}