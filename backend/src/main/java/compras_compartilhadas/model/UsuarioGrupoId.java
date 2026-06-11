package compras_compartilhadas.model;

import java.io.Serializable;
import java.util.Objects;

public class UsuarioGrupoId implements Serializable {

    private Integer usuarioId;

    private Integer grupoId;

    public UsuarioGrupoId() {
    }

    public UsuarioGrupoId(Integer usuarioId, Integer grupoId) {
        this.usuarioId = usuarioId;
        this.grupoId = grupoId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UsuarioGrupoId)) return false;

        UsuarioGrupoId that = (UsuarioGrupoId) o;

        return Objects.equals(usuarioId, that.usuarioId)
                && Objects.equals(grupoId, that.grupoId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(usuarioId, grupoId);
    }
}