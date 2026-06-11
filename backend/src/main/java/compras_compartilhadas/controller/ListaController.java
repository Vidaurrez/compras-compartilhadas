package compras_compartilhadas.controller;

import compras_compartilhadas.model.Lista;
import compras_compartilhadas.repository.ListaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/listas")
public class ListaController {

    private final ListaRepository listaRepository;

    public ListaController(ListaRepository listaRepository) {
        this.listaRepository = listaRepository;
    }

    @GetMapping
    public List<Lista> listarListas() {
        return listaRepository.findAll();
    }

    @GetMapping("/{id}")
    public Lista buscarListaPorId(@PathVariable Integer id) {
        return listaRepository.findById(id).orElse(null);
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

        lista.setGrupoId(listaAtualizada.getGrupoId());
        lista.setTitulo(listaAtualizada.getTitulo());
        lista.setStatus(listaAtualizada.getStatus());

        return listaRepository.save(lista);
    }

    @DeleteMapping("/{id}")
    public void deletarLista(@PathVariable Integer id) {
        listaRepository.deleteById(id);
    }
}