import { useEffect, useState } from "react";
import { API_URL } from "../config";

function GrupoDetalhes({ grupo, voltar, abrirLista }) {
  const [listas, setListas] = useState([]);
  const [tituloLista, setTituloLista] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [membros, setMembros] = useState([]);
  const [confirmacao, setConfirmacao] = useState(null);

  function carregarListas() {
    fetch(`${API_URL}/grupos/${grupo.id}/listas`)
      .then((resposta) => resposta.json())
      .then((dados) => setListas(dados))
      .catch((erro) => {
        console.error("Erro ao buscar listas:", erro);
      });
  }

  function carregarMembros() {
    fetch(`${API_URL}/grupos/${grupo.id}/membros`)
      .then((resposta) => resposta.json())
      .then((dados) => setMembros(dados))
      .catch((erro) => {
        console.error("Erro ao buscar membros:", erro);
      });
  }

  useEffect(() => {
    carregarListas();
    carregarMembros();
  }, [grupo.id]);

  function criarLista(event) {
    event.preventDefault();

    fetch(`${API_URL}/listas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titulo: tituloLista,
        status: "ABERTA",
        grupo: {
          id: grupo.id,
        },
      }),
    })
      .then((resposta) => resposta.json())
      .then(() => {
        setTituloLista("");
        setMensagem("Lista criada com sucesso!");
        carregarListas();
      })
      .catch((erro) => {
        console.error("Erro ao criar lista:", erro);
        setMensagem("Erro ao criar lista");
      });
  }

  function confirmarExclusaoLista(listaId) {
    setConfirmacao({
      titulo: "Excluir lista?",
      mensagem:
        "Tem certeza que deseja excluir esta lista? Os itens e compras vinculados também serão apagados.",
      textoBotao: "Excluir lista",
      aoConfirmar: () => excluirLista(listaId),
    });
  }

  function excluirLista(listaId) {
    fetch(`${API_URL}/listas/${listaId}`, {
      method: "DELETE",
    })
      .then(() => {
        setMensagem("Lista excluída com sucesso!");
        carregarListas();
      })
      .catch((erro) => {
        console.error("Erro ao excluir lista:", erro);
        setMensagem("Erro ao excluir lista");
      });
  }

  return (
    <section>
      <button onClick={voltar}>Voltar</button>

      <h2>{grupo.titulo}</h2>
      <p>Código de convite: {grupo.codigoConvite}</p>

      {grupo.criadoPor && <p>Criado por: {grupo.criadoPor.nome}</p>}

      <h3>👥 Membros do grupo</h3>

      {membros.length === 0 ? (
        <p>Nenhum membro encontrado.</p>
      ) : (
        <div className="membros-grid">
          {membros.map((membro) => {
            const usuarioEhCriador =
              grupo.criadoPor && grupo.criadoPor.id === membro.usuario.id;

            return (
              <div
                className="membro-card"
                key={`${membro.usuario.id}-${membro.grupo.id}`}
              >
                <div className="membro-avatar">
                  {membro.usuario.nome.charAt(0).toUpperCase()}
                </div>

                <div>
                  <strong>{membro.usuario.nome}</strong>

                  <p>
                    {usuarioEhCriador ? "Criador do grupo" : "Membro do grupo"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <form onSubmit={criarLista}>
        <h3>➕ Criar Lista</h3>

        <input
          type="text"
          placeholder="Nome da lista"
          value={tituloLista}
          onChange={(event) => setTituloLista(event.target.value)}
        />

        <button type="submit">Criar Lista</button>
      </form>

      {mensagem && <p>{mensagem}</p>}

      <h3>📝 Listas do grupo</h3>

      {listas.length === 0 ? (
        <p>Nenhuma lista criada ainda.</p>
      ) : (
        <div className="cards-grid">
          {listas.map((lista) => (
            <div key={lista.id}>
              <h4>{lista.titulo}</h4>
              <p>Status: {lista.status}</p>

              <div className="card-actions">
                <button onClick={() => abrirLista(lista)}>Abrir Lista</button>

                <button
                  className="danger"
                  onClick={() => confirmarExclusaoLista(lista.id)}
                >
                  Excluir Lista
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmacao && (
        <div className="modal-overlay">
          <div className="modal-confirmacao">
            <h3>{confirmacao.titulo}</h3>
            <p>{confirmacao.mensagem}</p>

            <div className="modal-actions">
              <button onClick={() => setConfirmacao(null)}>Cancelar</button>

              <button
                className="danger"
                onClick={() => {
                  confirmacao.aoConfirmar();
                  setConfirmacao(null);
                }}
              >
                {confirmacao.textoBotao}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default GrupoDetalhes;