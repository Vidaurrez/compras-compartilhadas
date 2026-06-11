package compras_compartilhadas.model;

import java.io.Serializable;
import java.util.Objects;

public class UsuarioGrupoId implements Serializable {

    private Integer usuario;
    private Integer grupo;

    public UsuarioGrupoId() {
    }

    public UsuarioGrupoId(Integer usuario, Integer grupo) {
        this.usuario = usuario;
        this.grupo = grupo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UsuarioGrupoId)) return false;

        UsuarioGrupoId that = (UsuarioGrupoId) o;

        return Objects.equals(usuario, that.usuario)
                && Objects.equals(grupo, that.grupo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(usuario, grupo);
    }
}