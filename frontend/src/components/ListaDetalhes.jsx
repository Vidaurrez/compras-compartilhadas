import { useEffect, useState } from "react";

function ListaDetalhes({ lista, usuarioLogado, voltar }) {
  const [itens, setItens] = useState([]);
  const [comprasPorItem, setComprasPorItem] = useState({});
  const [nomeItem, setNomeItem] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidade, setUnidade] = useState("");
  const [valoresCompra, setValoresCompra] = useState({});
  const [mensagem, setMensagem] = useState("");

  function carregarItens() {
    fetch(`http://localhost:8080/listas/${lista.id}/itens`)
      .then((resposta) => resposta.json())
      .then((dados) => {
        setItens(dados);
        carregarComprasDosItens(dados);
      })
      .catch((erro) => {
        console.error("Erro ao buscar itens:", erro);
      });
  }

  function carregarComprasDosItens(listaItens) {
    listaItens.forEach((item) => {
      fetch(`http://localhost:8080/compras/item/${item.id}`)
        .then((resposta) => resposta.json())
        .then((dados) => {
          if (dados.length > 0) {
            setComprasPorItem((comprasAtuais) => ({
              ...comprasAtuais,
              [item.id]: dados[0],
            }));
          }
        })
        .catch((erro) => {
          console.error("Erro ao buscar compra do item:", erro);
        });
    });
  }

  useEffect(() => {
    carregarItens();
  }, [lista.id]);

  function criarItem(event) {
    event.preventDefault();

    fetch("http://localhost:8080/itens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: nomeItem,
        quantidade: Number(quantidade),
        unidade: unidade || null,
        comprado: false,
        lista: {
          id: lista.id,
        },
        adicionadoPor: {
          id: usuarioLogado.id,
        },
      }),
    })
      .then((resposta) => resposta.json())
      .then(() => {
        setNomeItem("");
        setQuantidade("");
        setUnidade("");
        setMensagem("Item criado com sucesso!");
        carregarItens();
      })
      .catch((erro) => {
        console.error("Erro ao criar item:", erro);
        setMensagem("Erro ao criar item");
      });
  }

  function atualizarValorCompra(itemId, valor) {
    setValoresCompra({
      ...valoresCompra,
      [itemId]: valor,
    });
  }

  function marcarComoComprado(item) {
    const valor = valoresCompra[item.id];

    if (!valor) {
      setMensagem("Informe o valor da compra");
      return;
    }

    fetch("http://localhost:8080/compras", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item: {
          id: item.id,
        },
        usuario: {
          id: usuarioLogado.id,
        },
        valor: Number(valor),
      }),
    })
      .then((resposta) => resposta.json())
      .then(() => {
        setMensagem("Item marcado como comprado!");
        setValoresCompra({
          ...valoresCompra,
          [item.id]: "",
        });
        carregarItens();
      })
      .catch((erro) => {
        console.error("Erro ao marcar item como comprado:", erro);
        setMensagem("Erro ao marcar item como comprado");
      });
  }

  return (
    <section>
      <button onClick={voltar}>Voltar para o grupo</button>

      <h2>{lista.titulo}</h2>
      <p>Status: {lista.status}</p>

      <form onSubmit={criarItem}>
        <h3>Adicionar Item</h3>

        <input
          type="text"
          placeholder="Nome do item"
          value={nomeItem}
          onChange={(event) => setNomeItem(event.target.value)}
        />

        <input
          type="number"
          placeholder="Quantidade"
          value={quantidade}
          onChange={(event) => setQuantidade(event.target.value)}
        />

        <input
          type="text"
          placeholder="Unidade opcional. Ex: kg, pacote, litro"
          value={unidade}
          onChange={(event) => setUnidade(event.target.value)}
        />

        <button type="submit">Adicionar Item</button>
      </form>

      {mensagem && <p>{mensagem}</p>}

      <h3>Itens da lista</h3>

      {itens.length === 0 ? (
        <p>Nenhum item criado ainda.</p>
      ) : (
        <div>
          {itens.map((item) => {
            const compra = comprasPorItem[item.id];

            return (
              <div key={item.id}>
                <h4>{item.nome}</h4>

                <p>
                  Quantidade: {item.quantidade}
                  {item.unidade && ` ${item.unidade}`}
                </p>

                <p>Comprado: {item.comprado ? "Sim" : "Não"}</p>

                {item.adicionadoPor && (
                  <p>Adicionado por: {item.adicionadoPor.nome}</p>
                )}

                {item.comprado && compra && (
                  <div>
                    <p>Comprado por: {compra.usuario.nome}</p>
                    <p>Valor pago: R$ {compra.valor}</p>
                  </div>
                )}

                {!item.comprado && (
                  <div>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Valor pago"
                      value={valoresCompra[item.id] || ""}
                      onChange={(event) =>
                        atualizarValorCompra(item.id, event.target.value)
                      }
                    />

                    <button onClick={() => marcarComoComprado(item)}>
                      Marcar como comprado
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ListaDetalhes;