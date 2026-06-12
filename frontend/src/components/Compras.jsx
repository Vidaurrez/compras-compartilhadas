function Compras({ compras }) {
  return (
    <section>
      <h2>Compras</h2>

      <div>
        {compras.map((compra) => (
          <div key={compra.id}>
            <h3>{compra.item ? compra.item.nome : "Item não informado"}</h3>

            <p>
              Valor:{" "}
              {Number(compra.valor).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>

            {compra.usuario && (
              <p>Comprado por: {compra.usuario.nome}</p>
            )}

            {compra.compradoEm && (
              <p>Comprado em: {compra.compradoEm}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Compras;