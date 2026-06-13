package compras_compartilhadas.controller;

import compras_compartilhadas.model.Compra;
import compras_compartilhadas.model.Item;
import compras_compartilhadas.repository.CompraRepository;
import compras_compartilhadas.repository.ItemRepository;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/compras")
public class CompraController {

    private final CompraRepository compraRepository;
    private final ItemRepository itemRepository;

    public CompraController(CompraRepository compraRepository,
                            ItemRepository itemRepository) {
        this.compraRepository = compraRepository;
        this.itemRepository = itemRepository;
    }

    @GetMapping
    public List<Compra> listarCompras() {
        return compraRepository.findAll();
    }

    @GetMapping("/{id}")
    public Compra buscarCompraPorId(@PathVariable Integer id) {
        return compraRepository.findById(id).orElse(null);
    }

    @GetMapping("/item/{itemId}")
    public List<Compra> listarComprasDoItem(@PathVariable Integer itemId) {
        return compraRepository.findByItem_Id(itemId);
    }

    @PostMapping
    public Compra criarCompra(@RequestBody Compra compra) {
        compra.setCompradoEm(LocalDateTime.now());

        Compra compraSalva = compraRepository.save(compra);

        if (compraSalva.getItem() != null) {
            Item item = itemRepository.findById(compraSalva.getItem().getId()).orElse(null);

            if (item != null) {
                item.setComprado(true);
                itemRepository.save(item);
            }
        }

        return compraSalva;
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