package compras_compartilhadas.controller;

import compras_compartilhadas.model.Item;
import compras_compartilhadas.repository.ItemRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/itens")
public class ItemController {

    private final ItemRepository itemRepository;

    public ItemController(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @GetMapping
    public List<Item> listarItens() {
        return itemRepository.findAll();
    }

    @GetMapping("/{id}")
    public Item buscarItemPorId(@PathVariable Integer id) {
        return itemRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Item criarItem(@RequestBody Item item) {
        return itemRepository.save(item);
    }

    @PutMapping("/{id}")
    public Item atualizarItem(@PathVariable Integer id, @RequestBody Item itemAtualizado) {
        Item item = itemRepository.findById(id).orElse(null);

        if (item == null) {
            return null;
        }

        item.setLista(itemAtualizado.getLista());
        item.setNome(itemAtualizado.getNome());
        item.setQuantidade(itemAtualizado.getQuantidade());
        item.setUnidade(itemAtualizado.getUnidade());
        item.setComprado(itemAtualizado.getComprado());
        item.setAdicionadoPor(itemAtualizado.getAdicionadoPor());

        return itemRepository.save(item);
    }

    @DeleteMapping("/{id}")
    public void deletarItem(@PathVariable Integer id) {
        itemRepository.deleteById(id);
    }
}