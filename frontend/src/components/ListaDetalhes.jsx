import { useEffect, useState } from "react";
import { API_URL } from "../config";

function ListaDetalhes({ lista, usuarioLogado, voltar }) {
  const [itens, setItens] = useState([]);
  const [comprasPorItem, setComprasPorItem] = useState({});
  const [nomeItem, setNomeItem] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidade, setUnidade] = useState("");
  const [valoresCompra, setValoresCompra] = useState({});
  const [mensagem, setMensagem] = useState("");
  const [resumo, setResumo] = useState(null);

  function carregarItens() {
    fetch(`${API_URL}/listas/${lista.id}/itens`)
      .then((resposta) => resposta.json())
      .then((dados) => {
        setItens(dados);
        carregarComprasDosItens(dados);
      })
      .catch((erro) => {
        console.error("Erro ao buscar itens:", erro);
      });
  }

  function carregarResumo() {
    fetch(`${API_URL}/listas/${lista.id}/resumo`)
      .then((resposta) => resposta.json())
      .then((dados) => setResumo(dados))
      .catch((erro) => {
        console.error("Erro ao buscar resumo da lista:", erro);
      });
  }

  function carregarComprasDosItens(listaItens) {
    setComprasPorItem({});

    listaItens.forEach((item) => {
      fetch(`${API_URL}/compras/item/${item.id}`)
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
    carregarResumo();
  }, [lista.id]);

  function criarItem(event) {
    event.preventDefault();

    fetch(`${API_URL}/itens`, {
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
        carregarResumo();
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

    fetch(`${API_URL}/compras`, {
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
        carregarResumo();
      })
      .catch((erro) => {
        console.error("Erro ao marcar item como comprado:", erro);
        setMensagem("Erro ao marcar item como comprado");
      });
  }

  function excluirItem(itemId) {
    fetch(`${API_URL}/itens/${itemId}`, {
      method: "DELETE",
    })
      .then(() => {
        setMensagem("Item excluído com sucesso!");
        carregarItens();
        carregarResumo();
      })
      .catch((erro) => {
        console.error("Erro ao excluir item:", erro);
        setMensagem("Erro ao excluir item");
      });
  }

  function finalizarLista() {
    fetch(`${API_URL}/listas/${lista.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...lista,
        status: "FINALIZADA",
      }),
    })
      .then((resposta) => resposta.json())
      .then(() => {
        window.location.reload();
      })
      .catch((erro) => {
        console.error("Erro ao finalizar lista:", erro);
      });
  }

  function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <section>
      <button onClick={voltar}>Voltar para o grupo</button>

      <h2>{lista.titulo}</h2>
      <p>Status: {lista.status}</p>

      {lista.status !== "FINALIZADA" && (
        <button onClick={finalizarLista}>Finalizar Lista</button>
      )}

      <h3>📊 Resumo da lista</h3>

      {!resumo ? (
        <p>Carregando resumo...</p>
      ) : (
        <div className="resumo-lista">
          <div className="resumo-cards">
            <div className="resumo-card">
              <span>Total da lista</span>
              <strong>{formatarMoeda(resumo.totalGasto)}</strong>
            </div>

            <div className="resumo-card">
              <span>Membros</span>
              <strong>{resumo.quantidadeMembros}</strong>
            </div>

            <div className="resumo-card">
              <span>Valor por pessoa</span>
              <strong>{formatarMoeda(resumo.valorPorPessoa)}</strong>
            </div>
          </div>

          <h4>Divisão por membro</h4>

          <div className="membros-resumo">
            {resumo.gastosPorUsuario.map((usuario) => (
              <div className="membro-resumo-card" key={usuario.usuarioId}>
                <strong>{usuario.nome}</strong>

                <p>Gastou: {formatarMoeda(usuario.totalGasto)}</p>

                {Number(usuario.saldo) > 0 && (
                  <p className="saldo positivo">
                    Recebe: {formatarMoeda(usuario.saldo)}
                  </p>
                )}

                {Number(usuario.saldo) < 0 && (
                  <p className="saldo negativo">
                    Paga: {formatarMoeda(Math.abs(usuario.saldo))}
                  </p>
                )}

                {Number(usuario.saldo) === 0 && (
                  <p className="saldo zerado">Saldo zerado</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {lista.status !== "FINALIZADA" && (
        <form onSubmit={criarItem}>
          <h3>➕ Adicionar Item</h3>

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
      )}

      {mensagem && <p>{mensagem}</p>}

      <h3>📦 Itens da lista</h3>

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
                    <p>Valor pago: {formatarMoeda(compra.valor)}</p>
                  </div>
                )}

                {!item.comprado && lista.status !== "FINALIZADA" && (
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

                {lista.status !== "FINALIZADA" && (
                  <button
                    className="danger"
                    onClick={() => excluirItem(item.id)}
                  >
                    Excluir Item
                  </button>
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