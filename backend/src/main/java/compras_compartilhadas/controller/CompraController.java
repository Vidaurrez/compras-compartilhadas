package compras_compartilhadas.controller;

import compras_compartilhadas.model.Compra;
import compras_compartilhadas.repository.CompraRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/compras")
public class CompraController {

    private final CompraRepository compraRepository;

    public CompraController(CompraRepository compraRepository) {
        this.compraRepository = compraRepository;
    }

    @GetMapping
    public List<Compra> listarCompras() {
        return compraRepository.findAll();
    }

    @GetMapping("/{id}")
    public Compra buscarCompraPorId(@PathVariable Integer id) {
        return compraRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Compra criarCompra(@RequestBody Compra compra) {
        return compraRepository.save(compra);
    }

    @PutMapping("/{id}")
    public Compra atualizarCompra(@PathVariable Integer id, @RequestBody Compra compraAtualizada) {
        Compra compra = compraRepository.findById(id).orElse(null);

        if (compra == null) {
            return null;
        }

        compra.setItem(compraAtualizada.getItem());
        compra.setUsuario(compraAtualizada.getUsuario());
        compra.setValor(compraAtualizada.getValor());

        return compraRepository.save(compra);
    }

    @DeleteMapping("/{id}")
    public void deletarCompra(@PathVariable Integer id) {
        compraRepository.deleteById(id);
    }
}