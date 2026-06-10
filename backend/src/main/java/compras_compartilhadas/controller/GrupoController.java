package compras_compartilhadas.controller;

import compras_compartilhadas.model.Grupo;
import compras_compartilhadas.repository.GrupoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/grupos")
public class GrupoController {

    private final GrupoRepository grupoRepository;

    public GrupoController(GrupoRepository grupoRepository) {
        this.grupoRepository = grupoRepository;
    }

    // GET /grupos
    @GetMapping
    public List<Grupo> listarGrupos() {
        return grupoRepository.findAll();
    }

    // GET /grupos/{id}
    @GetMapping("/{id}")
    public Grupo buscarGrupoPorId(@PathVariable Integer id) {
        return grupoRepository.findById(id).orElse(null);
    }

    // POST /grupos
    @PostMapping
    public Grupo criarGrupo(@RequestBody Grupo grupo) {
        return grupoRepository.save(grupo);
    }

    // PUT /grupos/{id}
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

    // DELETE /grupos/{id}
    @DeleteMapping("/{id}")
    public void deletarGrupo(@PathVariable Integer id) {
        grupoRepository.deleteById(id);
    }
}