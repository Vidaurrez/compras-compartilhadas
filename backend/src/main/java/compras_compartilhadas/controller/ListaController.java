package compras_compartilhadas.controller;

import compras_compartilhadas.model.Compra;
import compras_compartilhadas.model.Item;
import compras_compartilhadas.model.Lista;
import compras_compartilhadas.model.Usuario;
import compras_compartilhadas.model.UsuarioGrupo;

import compras_compartilhadas.repository.CompraRepository;
import compras_compartilhadas.repository.ItemRepository;
import compras_compartilhadas.repository.ListaRepository;
import compras_compartilhadas.repository.UsuarioGrupoRepository;

import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/listas")
public class ListaController {

    private final ListaRepository listaRepository;
    private final ItemRepository itemRepository;
    private final CompraRepository compraRepository;
    private final UsuarioGrupoRepository usuarioGrupoRepository;

    public ListaController(ListaRepository listaRepository,
                           ItemRepository itemRepository,
                           CompraRepository compraRepository,
                           UsuarioGrupoRepository usuarioGrupoRepository) {
        this.listaRepository = listaRepository;
        this.itemRepository = itemRepository;
        this.compraRepository = compraRepository;
        this.usuarioGrupoRepository = usuarioGrupoRepository;
    }

    @GetMapping
    public List<Lista> listarListas() {
        return listaRepository.findAll();
    }

    @GetMapping("/{id}")
    public Lista buscarListaPorId(@PathVariable Integer id) {
        return listaRepository.findById(id).orElse(null);
    }

    @GetMapping("/{id}/itens")
    public List<Item> listarItensDaLista(@PathVariable Integer id) {
        return itemRepository.findByLista_Id(id);
    }

    @GetMapping("/{id}/resumo")
    public ResumoListaResponse resumoFinanceiroDaLista(@PathVariable Integer id) {
        Lista lista = listaRepository.findById(id).orElse(null);

        if (lista == null || lista.getGrupo() == null) {
            return new ResumoListaResponse(
                    BigDecimal.ZERO,
                    0,
                    BigDecimal.ZERO,
                    new ArrayList<>()
            );
        }

        Integer grupoId = lista.getGrupo().getId();

        List<UsuarioGrupo> membros = usuarioGrupoRepository.findByGrupo_Id(grupoId);
        List<Compra> compras = compraRepository.findByItem_Lista_Id(id);

        BigDecimal totalGasto = BigDecimal.ZERO;

        for (Compra compra : compras) {
            if (compra.getValor() != null) {
                totalGasto = totalGasto.add(compra.getValor());
            }
        }

        int quantidadeMembros = membros.size();

        BigDecimal valorPorPessoa = BigDecimal.ZERO;

        if (quantidadeMembros > 0) {
            valorPorPessoa = totalGasto.divide(
                    BigDecimal.valueOf(quantidadeMembros),
                    2,
                    RoundingMode.HALF_UP
            );
        }

        List<GastoUsuarioResponse> gastosPorUsuario = new ArrayList<>();

        for (UsuarioGrupo membro : membros) {
            Usuario usuario = membro.getUsuario();
            BigDecimal totalUsuario = BigDecimal.ZERO;

            for (Compra compra : compras) {
                if (
                        compra.getUsuario() != null &&
                        compra.getUsuario().getId().equals(usuario.getId()) &&
                        compra.getValor() != null
                ) {
                    totalUsuario = totalUsuario.add(compra.getValor());
                }
            }

            BigDecimal saldo = totalUsuario.subtract(valorPorPessoa);

            gastosPorUsuario.add(new GastoUsuarioResponse(
                    usuario.getId(),
                    usuario.getNome(),
                    totalUsuario,
                    saldo
            ));
        }

        return new ResumoListaResponse(
                totalGasto,
                quantidadeMembros,
                valorPorPessoa,
                gastosPorUsuario
        );
    }

    @PostMapping
    public Lista criarLista(@RequestBody Lista lista) {
        return listaRepository.save(lista);
    }

    @PutMapping("/{id}")
    public Lista atualizarLista(@PathVariable Integer id, @RequestBody Lista listaAtualizada) {
        Lista lista = listaRepository.findById(id).orElse(null);

        if (lista == null) {
            return null;
        }

        lista.setGrupo(listaAtualizada.getGrupo());
        lista.setTitulo(listaAtualizada.getTitulo());
        lista.setStatus(listaAtualizada.getStatus());

        return listaRepository.save(lista);
    }

    @DeleteMapping("/{id}")
    public void deletarLista(@PathVariable Integer id) {
        List<Compra> comprasDaLista = compraRepository.findByItem_Lista_Id(id);
        compraRepository.deleteAll(comprasDaLista);

        List<Item> itensDaLista = itemRepository.findByLista_Id(id);
        itemRepository.deleteAll(itensDaLista);

        listaRepository.deleteById(id);
    }
    
    public static class ResumoListaResponse {
        private BigDecimal totalGasto;
        private int quantidadeMembros;
        private BigDecimal valorPorPessoa;
        private List<GastoUsuarioResponse> gastosPorUsuario;

        public ResumoListaResponse(BigDecimal totalGasto,
                                   int quantidadeMembros,
                                   BigDecimal valorPorPessoa,
                                   List<GastoUsuarioResponse> gastosPorUsuario) {
            this.totalGasto = totalGasto;
            this.quantidadeMembros = quantidadeMembros;
            this.valorPorPessoa = valorPorPessoa;
            this.gastosPorUsuario = gastosPorUsuario;
        }

        public BigDecimal getTotalGasto() {
            return totalGasto;
        }

        public int getQuantidadeMembros() {
            return quantidadeMembros;
        }

        public BigDecimal getValorPorPessoa() {
            return valorPorPessoa;
        }

        public List<GastoUsuarioResponse> getGastosPorUsuario() {
            return gastosPorUsuario;
        }
    }

    public static class GastoUsuarioResponse {
        private Integer usuarioId;
        private String nome;
        private BigDecimal totalGasto;
        private BigDecimal saldo;

        public GastoUsuarioResponse(Integer usuarioId,
                                    String nome,
                                    BigDecimal totalGasto,
                                    BigDecimal saldo) {
            this.usuarioId = usuarioId;
            this.nome = nome;
            this.totalGasto = totalGasto;
            this.saldo = saldo;
        }

        public Integer getUsuarioId() {
            return usuarioId;
        }

        public String getNome() {
            return nome;
        }

        public BigDecimal getTotalGasto() {
            return totalGasto;
        }

        public BigDecimal getSaldo() {
            return saldo;
        }
    }
}