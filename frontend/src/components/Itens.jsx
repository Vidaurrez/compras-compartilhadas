function Itens({ itens }) {
  return (
    <section>
      <h2>Itens</h2>

      <div>
        {itens.map((item) => (
          <div key={item.id}>
            <h3>{item.nome}</h3>

            <p>
              Quantidade: {item.quantidade} {item.unidade}
            </p>

            <p>Comprado: {item.comprado ? "Sim" : "Não"}</p>

            {item.lista && (
              <p>Lista: {item.lista.titulo}</p>
            )}

            {item.adicionadoPor && (
              <p>Adicionado por: {item.adicionadoPor.nome}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Itens;