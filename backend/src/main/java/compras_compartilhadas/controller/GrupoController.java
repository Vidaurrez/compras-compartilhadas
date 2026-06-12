package compras_compartilhadas.controller;

import compras_compartilhadas.model.Compra;
import compras_compartilhadas.model.Grupo;
import compras_compartilhadas.model.Lista;
import compras_compartilhadas.model.Usuario;
import compras_compartilhadas.model.UsuarioGrupo;

import compras_compartilhadas.repository.CompraRepository;
import compras_compartilhadas.repository.GrupoRepository;
import compras_compartilhadas.repository.ListaRepository;
import compras_compartilhadas.repository.UsuarioGrupoRepository;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/grupos")
public class GrupoController {

    private final CompraRepository compraRepository;
    private final GrupoRepository grupoRepository;
    private final ListaRepository listaRepository;
    private final UsuarioGrupoRepository usuarioGrupoRepository;

    public GrupoController(GrupoRepository grupoRepository,
                           ListaRepository listaRepository,
                           CompraRepository compraRepository,
                           UsuarioGrupoRepository usuarioGrupoRepository) {
        this.grupoRepository = grupoRepository;
        this.listaRepository = listaRepository;
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

    @DeleteMapping("/{id}")
    public void deletarGrupo(@PathVariable Integer id) {
        grupoRepository.deleteById(id);
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