package compras_compartilhadas.controller;

import compras_compartilhadas.model.Grupo;
import compras_compartilhadas.model.UsuarioGrupo;
import compras_compartilhadas.model.UsuarioGrupoId;
import compras_compartilhadas.repository.UsuarioGrupoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/grupos")
public class GrupoMembroController {

    private final UsuarioGrupoRepository usuarioGrupoRepository;

    public GrupoMembroController(UsuarioGrupoRepository usuarioGrupoRepository) {
        this.usuarioGrupoRepository = usuarioGrupoRepository;
    }

    @GetMapping("/{grupoId}/membros")
    public List<UsuarioGrupo> listarMembros(@PathVariable Integer grupoId) {
        return usuarioGrupoRepository.findByGrupo_Id(grupoId);
    }

    @PostMapping("/{grupoId}/membros")
    public UsuarioGrupo adicionarMembro(@PathVariable Integer grupoId,
                                        @RequestBody UsuarioGrupo usuarioGrupo) {

        Grupo grupo = new Grupo();
        grupo.setId(grupoId);

        usuarioGrupo.setGrupo(grupo);

        return usuarioGrupoRepository.save(usuarioGrupo);
    }

    @PutMapping("/{grupoId}/membros/{usuarioId}/papel")
    public UsuarioGrupo alterarPapel(@PathVariable Integer grupoId,
                                     @PathVariable Integer usuarioId,
                                     @RequestBody UsuarioGrupo dados) {

        UsuarioGrupoId id = new UsuarioGrupoId(usuarioId, grupoId);

        UsuarioGrupo membro = usuarioGrupoRepository.findById(id).orElse(null);

        if (membro == null) {
            return null;
        }

        membro.setPapel(dados.getPapel());

        return usuarioGrupoRepository.save(membro);
    }

    @DeleteMapping("/{grupoId}/membros/{usuarioId}")
    public void removerMembro(@PathVariable Integer grupoId,
                              @PathVariable Integer usuarioId) {

        UsuarioGrupoId id = new UsuarioGrupoId(usuarioId, grupoId);

        usuarioGrupoRepository.deleteById(id);
    }
}