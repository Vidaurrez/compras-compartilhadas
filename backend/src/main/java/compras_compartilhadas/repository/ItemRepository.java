package compras_compartilhadas.repository;

import compras_compartilhadas.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Integer> {

}