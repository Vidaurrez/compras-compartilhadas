package compras_compartilhadas.controller;

import compras_compartilhadas.model.Usuario;
import compras_compartilhadas.repository.UsuarioRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/cadastro")
public class CadastroController {

    private final UsuarioRepository usuarioRepository;

    public CadastroController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping
    public CadastroResponse cadastrar(@RequestBody CadastroRequest cadastroRequest) {

        if (usuarioRepository.existsByEmail(cadastroRequest.getEmail())) {
            return new CadastroResponse(false, "Email já cadastrado", null);
        }

        Usuario usuario = new Usuario();
        usuario.setNome(cadastroRequest.getNome());
        usuario.setEmail(cadastroRequest.getEmail());
        usuario.setSenhaHash(cadastroRequest.getSenha());
        usuario.setCriadoEm(LocalDateTime.now());

        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        return new CadastroResponse(true, "Cadastro realizado com sucesso", usuarioSalvo);
    }

    public static class CadastroRequest {
        private String nome;
        private String email;
        private String senha;

        public String getNome() {
            return nome;
        }

        public void setNome(String nome) {
            this.nome = nome;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getSenha() {
            return senha;
        }

        public void setSenha(String senha) {
            this.senha = senha;
        }
    }

    public static class CadastroResponse {
        private boolean sucesso;
        private String mensagem;
        private Usuario usuario;

        public CadastroResponse(boolean sucesso, String mensagem, Usuario usuario) {
            this.sucesso = sucesso;
            this.mensagem = mensagem;
            this.usuario = usuario;
        }

        public boolean isSucesso() {
            return sucesso;
        }

        public String getMensagem() {
            return mensagem;
        }

        public Usuario getUsuario() {
            return usuario;
        }
    }
}