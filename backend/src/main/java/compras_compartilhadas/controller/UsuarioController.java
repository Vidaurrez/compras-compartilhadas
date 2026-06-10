package compras_compartilhadas.controller;

import compras_compartilhadas.model.Usuario;
import compras_compartilhadas.repository.UsuarioRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // READ - listar todos os usuários
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // READ - buscar usuário por id
    @GetMapping("/{id}")
    public Usuario buscarUsuarioPorId(@PathVariable Integer id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    // CREATE - criar novo usuário
    @PostMapping
    public Usuario criarUsuario(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // UPDATE - atualizar usuário existente
    @PutMapping("/{id}")
    public Usuario atualizarUsuario(@PathVariable Integer id, @RequestBody Usuario usuarioAtualizado) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);

        if (usuario == null) {
            return null;
        }

        usuario.setNome(usuarioAtualizado.getNome());
        usuario.setEmail(usuarioAtualizado.getEmail());
        usuario.setSenhaHash(usuarioAtualizado.getSenhaHash());

        return usuarioRepository.save(usuario);
    }

    // DELETE - excluir usuário
    @DeleteMapping("/{id}")
    public void deletarUsuario(@PathVariable Integer id) {
        usuarioRepository.deleteById(id);
    }
}