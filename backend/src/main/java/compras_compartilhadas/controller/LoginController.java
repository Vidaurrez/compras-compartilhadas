package compras_compartilhadas.controller;

import compras_compartilhadas.model.Usuario;
import compras_compartilhadas.repository.UsuarioRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/login")
public class LoginController {

    private final UsuarioRepository usuarioRepository;

    public LoginController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping
    public LoginResponse login(@RequestBody LoginRequest loginRequest) {

        Optional<Usuario> usuarioEncontrado =
                usuarioRepository.findByEmail(loginRequest.getEmail());

        if (usuarioEncontrado.isEmpty()) {
            return new LoginResponse(false, "Email não encontrado", null);
        }

        Usuario usuario = usuarioEncontrado.get();

        if (!usuario.getSenhaHash().equals(loginRequest.getSenha())) {
            return new LoginResponse(false, "Senha incorreta", null);
        }

        return new LoginResponse(true, "Login realizado com sucesso", usuario);
    }

    public static class LoginRequest {
        private String email;
        private String senha;

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

    public static class LoginResponse {
        private boolean sucesso;
        private String mensagem;
        private Usuario usuario;

        public LoginResponse(boolean sucesso, String mensagem, Usuario usuario) {
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