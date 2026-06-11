package compras_compartilhadas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuario_grupos")
@IdClass(UsuarioGrupoId.class)
public class UsuarioGrupo {

    @Id
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Id
    @ManyToOne
    @JoinColumn(name = "grupo_id")
    private Grupo grupo;

    private String papel;

    @Column(name = "entrou_em")
    private LocalDateTime entrouEm;

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Grupo getGrupo() {
        return grupo;
    }

    public void setGrupo(Grupo grupo) {
        this.grupo = grupo;
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