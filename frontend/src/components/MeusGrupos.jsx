import { useEffect, useState } from "react";
import { API_URL } from "../config";

function MeusGrupos({ usuarioLogado, grupos, atualizarGrupos, abrirGrupo }) {
  const [tituloGrupo, setTituloGrupo] = useState("");
  const [codigoConvite, setCodigoConvite] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [listasPorGrupo, setListasPorGrupo] = useState({});
  const [confirmacao, setConfirmacao] = useState(null);

  useEffect(() => {
    grupos.forEach((grupo) => {
      carregarListasDoGrupo(grupo.id);
    });
  }, [grupos]);

  function criarGrupo(event) {
    event.preventDefault();

    fetch(`${API_URL}/grupos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titulo: tituloGrupo,
        criadoPor: {
          id: usuarioLogado.id,
        },
      }),
    })
      .then((resposta) => resposta.json())
      .then(() => {
        setTituloGrupo("");
        setMensagem("Grupo criado com sucesso!");
        atualizarGrupos();
      })
      .catch((erro) => {
        console.error("Erro ao criar grupo:", erro);
        setMensagem("Erro ao criar grupo");
      });
  }

  function entrarGrupo(event) {
    event.preventDefault();

    fetch(`${API_URL}/grupos/entrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuarioId: usuarioLogado.id,
        codigoConvite: codigoConvite,
      }),
    })
      .then((resposta) => resposta.json())
      .then((dados) => {
        setMensagem(dados.mensagem);

        if (dados.sucesso) {
          setCodigoConvite("");
          atualizarGrupos();
        }
      })
      .catch((erro) => {
        console.error("Erro ao entrar no grupo:", erro);
        setMensagem("Erro ao entrar no grupo");
      });
  }

  function carregarListasDoGrupo(grupoId) {
    fetch(`${API_URL}/grupos/${grupoId}/listas`)
      .then((resposta) => resposta.json())
      .then((listas) => {
        setListasPorGrupo((listasAtuais) => ({
          ...listasAtuais,
          [grupoId]: listas,
        }));
      })
      .catch((erro) => {
        console.error("Erro ao buscar listas do grupo:", erro);
      });
  }

  function confirmarExclusaoGrupo(grupoId) {
    setConfirmacao({
      titulo: "Excluir grupo?",
      mensagem:
        "Tem certeza que deseja excluir este grupo? Todas as listas, itens e compras serão apagados.",
      textoBotao: "Excluir grupo",
      aoConfirmar: () => excluirGrupo(grupoId),
    });
  }

  function confirmarSaidaGrupo(grupoId) {
    setConfirmacao({
      titulo: "Sair do grupo?",
      mensagem: "Tem certeza que deseja sair deste grupo?",
      textoBotao: "Sair do grupo",
      aoConfirmar: () => sairDoGrupo(grupoId),
    });
  }

  function excluirGrupo(grupoId) {
    fetch(`${API_URL}/grupos/${grupoId}/criador/${usuarioLogado.id}`, {
      method: "DELETE",
    })
      .then((resposta) => resposta.json())
      .then((dados) => {
        setMensagem(dados.mensagem);

        if (dados.sucesso) {
          atualizarGrupos();
        }
      })
      .catch((erro) => {
        console.error("Erro ao excluir grupo:", erro);
        setMensagem("Erro ao excluir grupo");
      });
  }

  function sairDoGrupo(grupoId) {
    fetch(`${API_URL}/grupos/${grupoId}/usuario/${usuarioLogado.id}`, {
      method: "DELETE",
    })
      .then((resposta) => resposta.json())
      .then((dados) => {
        setMensagem(dados.mensagem);

        if (dados.sucesso) {
          atualizarGrupos();
        }
      })
      .catch((erro) => {
        console.error("Erro ao sair do grupo:", erro);
        setMensagem("Erro ao sair do grupo");
      });
  }

  return (
    <section>
      <h2>Meus Grupos</h2>

      <form onSubmit={criarGrupo}>
        <h3>➕ Criar Grupo</h3>

        <input
          type="text"
          placeholder="Nome do grupo"
          value={tituloGrupo}
          onChange={(event) => setTituloGrupo(event.target.value)}
        />

        <button type="submit">Criar Grupo</button>
      </form>

      <form onSubmit={entrarGrupo}>
        <h3>🚪 Entrar em Grupo</h3>

        <input
          type="text"
          placeholder="Código de convite"
          value={codigoConvite}
          onChange={(event) => setCodigoConvite(event.target.value)}
        />

        <button type="submit">Entrar</button>
      </form>

      {mensagem && <p>{mensagem}</p>}

      <h3>👥 Grupos que você participa</h3>

      <div className="cards-grid">
        {grupos.map((grupo) => {
          const usuarioEhCriador =
            grupo.criadoPor && grupo.criadoPor.id === usuarioLogado.id;

          const listasDoGrupo = listasPorGrupo[grupo.id] || [];
          const primeirasListas = listasDoGrupo.slice(0, 3);

          return (
            <div key={grupo.id}>
              <h4>{grupo.titulo}</h4>

              {grupo.criadoPor && <p>Criado por: {grupo.criadoPor.nome}</p>}

              <div className="card-listas">
                <strong>Listas:</strong>

                {primeirasListas.length > 0 ? (
                  primeirasListas.map((lista) => (
                    <p key={lista.id}>{lista.titulo}</p>
                  ))
                ) : (
                  <p>Nenhuma lista ainda</p>
                )}

                {listasDoGrupo.length > 3 && (
                  <p>+{listasDoGrupo.length - 3} lista(s)</p>
                )}
              </div>

              <div className="card-actions">
                <button onClick={() => abrirGrupo(grupo)}>Abrir Grupo</button>

                {usuarioEhCriador ? (
                  <button
                    className="danger"
                    onClick={() => confirmarExclusaoGrupo(grupo.id)}
                  >
                    Excluir Grupo
                  </button>
                ) : (
                  <button
                    className="danger"
                    onClick={() => confirmarSaidaGrupo(grupo.id)}
                  >
                    Sair do Grupo
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

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

export default MeusGrupos;