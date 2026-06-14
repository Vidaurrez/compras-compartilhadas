package compras_compartilhadas.controller;

import compras_compartilhadas.model.Compra;
import compras_compartilhadas.model.Grupo;
import compras_compartilhadas.model.Item;
import compras_compartilhadas.model.Lista;
import compras_compartilhadas.model.Usuario;
import compras_compartilhadas.model.UsuarioGrupo;

import compras_compartilhadas.repository.CompraRepository;
import compras_compartilhadas.repository.GrupoRepository;
import compras_compartilhadas.repository.ItemRepository;
import compras_compartilhadas.repository.ListaRepository;
import compras_compartilhadas.repository.UsuarioGrupoRepository;

import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/grupos")
public class GrupoController {

    private final CompraRepository compraRepository;
    private final GrupoRepository grupoRepository;
    private final ListaRepository listaRepository;
    private final ItemRepository itemRepository;
    private final UsuarioGrupoRepository usuarioGrupoRepository;

    public GrupoController(GrupoRepository grupoRepository,
                           ListaRepository listaRepository,
                           ItemRepository itemRepository,
                           CompraRepository compraRepository,
                           UsuarioGrupoRepository usuarioGrupoRepository) {
        this.grupoRepository = grupoRepository;
        this.listaRepository = listaRepository;
        this.itemRepository = itemRepository;
        this.compraRepository = compraRepository;
        this.usuarioGrupoRepository = usuarioGrupoRepository;
    }

    @GetMapping
    public List<Grupo> listarGrupos() {
        return grupoRepository.findAll();
    }

    @GetMapping("/{id}")
    public Grupo buscarGrupoPorId(@PathVariable Integer id) {
        return grupoRepository.findById(id).orElse(null);
    }

    @GetMapping("/{id}/listas")
    public List<Lista> listarListasDoGrupo(@PathVariable Integer id) {
        return listaRepository.findByGrupo_Id(id);
    }

    @GetMapping("/{id}/compras")
    public List<Compra> listarComprasDoGrupo(@PathVariable Integer id) {
        return compraRepository.findByItem_Lista_Grupo_Id(id);
    }

    @GetMapping("/{id}/resumo")
    public ResumoGrupoResponse resumoFinanceiroDoGrupo(@PathVariable Integer id) {
        List<UsuarioGrupo> membros = usuarioGrupoRepository.findByGrupo_Id(id);
        List<Compra> compras = compraRepository.findByItem_Lista_Grupo_Id(id);

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

        return new ResumoGrupoResponse(
                totalGasto,
                quantidadeMembros,
                valorPorPessoa,
                gastosPorUsuario
        );
    }

    @PostMapping
    public Grupo criarGrupo(@RequestBody Grupo grupo) {
        grupo.setCodigoConvite(gerarCodigoUnico());
        grupo.setCriadoEm(LocalDateTime.now());

        Grupo grupoSalvo = grupoRepository.save(grupo);

        if (grupoSalvo.getCriadoPor() != null) {
            UsuarioGrupo usuarioGrupo = new UsuarioGrupo();

            usuarioGrupo.setUsuario(grupoSalvo.getCriadoPor());
            usuarioGrupo.setGrupo(grupoSalvo);
            usuarioGrupo.setPapel("MEMBRO");
            usuarioGrupo.setEntrouEm(LocalDateTime.now());

            usuarioGrupoRepository.save(usuarioGrupo);
        }

        return grupoSalvo;
    }

    @PostMapping("/entrar")
    public EntrarGrupoResponse entrarNoGrupo(@RequestBody EntrarGrupoRequest request) {

        Grupo grupo = grupoRepository
                .findByCodigoConvite(request.getCodigoConvite())
                .orElse(null);

        if (grupo == null) {
            return new EntrarGrupoResponse(false, "Código de convite inválido");
        }

        boolean jaParticipa = usuarioGrupoRepository.existsByUsuario_IdAndGrupo_Id(
                request.getUsuarioId(),
                grupo.getId()
        );

        if (jaParticipa) {
            return new EntrarGrupoResponse(false, "Usuário já participa deste grupo");
        }

        Usuario usuario = new Usuario();
        usuario.setId(request.getUsuarioId());

        UsuarioGrupo usuarioGrupo = new UsuarioGrupo();
        usuarioGrupo.setUsuario(usuario);
        usuarioGrupo.setGrupo(grupo);
        usuarioGrupo.setPapel("MEMBRO");
        usuarioGrupo.setEntrouEm(LocalDateTime.now());

        usuarioGrupoRepository.save(usuarioGrupo);

        return new EntrarGrupoResponse(true, "Usuário entrou no grupo com sucesso");
    }

    @DeleteMapping("/{grupoId}/usuario/{usuarioId}")
    public EntrarGrupoResponse sairDoGrupo(@PathVariable Integer grupoId,
                                           @PathVariable Integer usuarioId) {

        Grupo grupo = grupoRepository.findById(grupoId).orElse(null);

        if (grupo == null) {
            return new EntrarGrupoResponse(false, "Grupo não encontrado");
        }

        if (
                grupo.getCriadoPor() != null &&
                grupo.getCriadoPor().getId().equals(usuarioId)
        ) {
            return new EntrarGrupoResponse(false, "O criador não pode sair do grupo. Ele pode excluir o grupo.");
        }

        UsuarioGrupo usuarioGrupo = usuarioGrupoRepository
                .findByUsuario_IdAndGrupo_Id(usuarioId, grupoId)
                .orElse(null);

        if (usuarioGrupo == null) {
            return new EntrarGrupoResponse(false, "Usuário não participa deste grupo");
        }

        usuarioGrupoRepository.delete(usuarioGrupo);

        return new EntrarGrupoResponse(true, "Você saiu do grupo com sucesso");
    }

    @DeleteMapping("/{grupoId}/criador/{usuarioId}")
    public EntrarGrupoResponse deletarGrupoComoCriador(@PathVariable Integer grupoId,
                                                       @PathVariable Integer usuarioId) {

        Grupo grupo = grupoRepository.findById(grupoId).orElse(null);

        if (grupo == null) {
            return new EntrarGrupoResponse(false, "Grupo não encontrado");
        }

        if (
                grupo.getCriadoPor() == null ||
                !grupo.getCriadoPor().getId().equals(usuarioId)
        ) {
            return new EntrarGrupoResponse(false, "Apenas o criador pode excluir o grupo");
        }

        List<Compra> comprasDoGrupo = compraRepository.findByItem_Lista_Grupo_Id(grupoId);
        compraRepository.deleteAll(comprasDoGrupo);

        List<Lista> listasDoGrupo = listaRepository.findByGrupo_Id(grupoId);

        for (Lista lista : listasDoGrupo) {
            List<Item> itensDaLista = itemRepository.findByLista_Id(lista.getId());
            itemRepository.deleteAll(itensDaLista);
        }

        listaRepository.deleteAll(listasDoGrupo);

        List<UsuarioGrupo> membrosDoGrupo = usuarioGrupoRepository.findByGrupo_Id(grupoId);
        usuarioGrupoRepository.deleteAll(membrosDoGrupo);

        grupoRepository.delete(grupo);

        return new EntrarGrupoResponse(true, "Grupo excluído com sucesso");
    }

    @PutMapping("/{id}")
    public Grupo atualizarGrupo(@PathVariable Integer id,
                                @RequestBody Grupo grupoAtualizado) {

        Grupo grupo = grupoRepository.findById(id).orElse(null);

        if (grupo == null) {
            return null;
        }

        grupo.setTitulo(grupoAtualizado.getTitulo());
        grupo.setCriadoPor(grupoAtualizado.getCriadoPor());

        return grupoRepository.save(grupo);
    }

    private String gerarCodigoUnico() {
        String caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();

        String codigo;

        do {
            StringBuilder sb = new StringBuilder();

            for (int i = 0; i < 6; i++) {
                int indice = random.nextInt(caracteres.length());
                sb.append(caracteres.charAt(indice));
            }

            codigo = sb.toString();

        } while (grupoRepository.existsByCodigoConvite(codigo));

        return codigo;
    }

    public static class ResumoGrupoResponse {
        private BigDecimal totalGasto;
        private int quantidadeMembros;
        private BigDecimal valorPorPessoa;
        private List<GastoUsuarioResponse> gastosPorUsuario;

        public ResumoGrupoResponse(BigDecimal totalGasto,
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

    public static class EntrarGrupoRequest {
        private Integer usuarioId;
        private String codigoConvite;

        public Integer getUsuarioId() {
            return usuarioId;
        }

        public void setUsuarioId(Integer usuarioId) {
            this.usuarioId = usuarioId;
        }

        public String getCodigoConvite() {
            return codigoConvite;
        }

        public void setCodigoConvite(String codigoConvite) {
            this.codigoConvite = codigoConvite;
        }
    }

    public static class EntrarGrupoResponse {
        private boolean sucesso;
        private String mensagem;

        public EntrarGrupoResponse(boolean sucesso, String mensagem) {
            this.sucesso = sucesso;
            this.mensagem = mensagem;
        }

        public boolean isSucesso() {
            return sucesso;
        }

        public String getMensagem() {
            return mensagem;
        }
    }
}