package compras_compartilhadas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "itens")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "lista_id")
    private Integer listaId;

    private String nome;

    private Integer quantidade;

    private String unidade;

    private Boolean comprado;

    @Column(name = "adicionado_por")
    private Integer adicionadoPor;

    @Column(name = "adicionado_em")
    private LocalDateTime adicionadoEm;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getListaId() {
        return listaId;
    }

    public void setListaId(Integer listaId) {
        this.listaId = listaId;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public String getUnidade() {
        return unidade;
    }

    public void setUnidade(String unidade) {
        this.unidade = unidade;
    }

    public Boolean getComprado() {
        return comprado;
    }

    public void setComprado(Boolean comprado) {
        this.comprado = comprado;
    }

    public Integer getAdicionadoPor() {
        return adicionadoPor;
    }

    public void setAdicionadoPor(Integer adicionadoPor) {
        this.adicionadoPor = adicionadoPor;
    }

    public LocalDateTime getAdicionadoEm() {
        return adicionadoEm;
    }

    public void setAdicionadoEm(LocalDateTime adicionadoEm) {
        this.adicionadoEm = adicionadoEm;
    }
}