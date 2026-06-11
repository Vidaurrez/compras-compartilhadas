package compras_compartilhadas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuario_grupos")
@IdClass(UsuarioGrupoId.class)
public class UsuarioGrupo {

    @Id
    @Column(name = "usuario_id")
    private Integer usuarioId;

    @Id
    @Column(name = "grupo_id")
    private Integer grupoId;

    private String papel;

    @Column(name = "entrou_em")
    private LocalDateTime entrouEm;

    public Integer getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Integer usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Integer getGrupoId() {
        return grupoId;
    }

    public void setGrupoId(Integer grupoId) {
        this.grupoId = grupoId;
    }

    public String getPapel() {
        return papel;
    }

    public void setPapel(String papel) {
        this.papel = papel;
    }

    public LocalDateTime getEntrouEm() {
        return entrouEm;
    }

    public void setEntrouEm(LocalDateTime entrouEm) {
        this.entrouEm = entrouEm;
    }
}