package compras_compartilhadas.controller;

import compras_compartilhadas.model.Grupo;
import compras_compartilhadas.model.Usuario;
import compras_compartilhadas.model.UsuarioGrupo;
import compras_compartilhadas.repository.UsuarioGrupoRepository;
import compras_compartilhadas.repository.UsuarioRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioGrupoRepository usuarioGrupoRepository;

    public UsuarioController(
            UsuarioRepository usuarioRepository,
            UsuarioGrupoRepository usuarioGrupoRepository) {

        this.usuarioRepository = usuarioRepository;
        this.usuarioGrupoRepository = usuarioGrupoRepository;
    }

    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/{id}")
    public Usuario buscarUsuarioPorId(@PathVariable Integer id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    @GetMapping("/{id}/grupos")
    public List<Grupo> listarGruposDoUsuario(@PathVariable Integer id) {
        return usuarioGrupoRepository.findByUsuario_Id(id)
                .stream()
                .map(UsuarioGrupo::getGrupo)
                .toList();
    }

    @PostMapping
    public Usuario criarUsuario(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @PutMapping("/{id}")
    public Usuario atualizarUsuario(
            @PathVariable Integer id,
            @RequestBody Usuario usuarioAtualizado) {

        Usuario usuario = usuarioRepository.findById(id).orElse(null);

        if (usuario == null) {
            return null;
        }

        usuario.setNome(usuarioAtualizado.getNome());
        usuario.setEmail(usuarioAtualizado.getEmail());
        usuario.setSenhaHash(usuarioAtualizado.getSenhaHash());

        return usuarioRepository.save(usuario);
    }

    @DeleteMapping("/{id}")
    public void deletarUsuario(@PathVariable Integer id) {
        usuarioRepository.deleteById(id);
    }
}