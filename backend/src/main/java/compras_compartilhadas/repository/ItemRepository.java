package compras_compartilhadas.repository;

import compras_compartilhadas.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Integer> {

    List<Item> findByLista_Id(Integer listaId);

}