import { useEffect, useState } from "react";

function MeusGrupos({ usuarioLogado, grupos, atualizarGrupos, abrirGrupo }) {
  const [tituloGrupo, setTituloGrupo] = useState("");
  const [codigoConvite, setCodigoConvite] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [listasPorGrupo, setListasPorGrupo] = useState({});

  useEffect(() => {
    grupos.forEach((grupo) => {
      carregarListasDoGrupo(grupo.id);
    });
  }, [grupos]);

  function criarGrupo(event) {
    event.preventDefault();

    fetch("http://localhost:8080/grupos", {
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

    fetch("http://localhost:8080/grupos/entrar", {
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
    fetch(`http://localhost:8080/grupos/${grupoId}/listas`)
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

  function excluirGrupo(grupoId) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este grupo? Todas as listas, itens e compras serão apagados."
    );

    if (!confirmar) {
      return;
    }

    fetch(`http://localhost:8080/grupos/${grupoId}/criador/${usuarioLogado.id}`, {
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
    const confirmar = window.confirm("Tem certeza que deseja sair deste grupo?");

    if (!confirmar) {
      return;
    }

    fetch(`http://localhost:8080/grupos/${grupoId}/usuario/${usuarioLogado.id}`, {
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
        <h3>Criar Grupo</h3>

        <input
          type="text"
          placeholder="Nome do grupo"
          value={tituloGrupo}
          onChange={(event) => setTituloGrupo(event.target.value)}
        />

        <button type="submit">Criar Grupo</button>
      </form>

      <form onSubmit={entrarGrupo}>
        <h3>Entrar em Grupo</h3>

        <input
          type="text"
          placeholder="Código de convite"
          value={codigoConvite}
          onChange={(event) => setCodigoConvite(event.target.value)}
        />

        <button type="submit">Entrar</button>
      </form>

      {mensagem && <p>{mensagem}</p>}

      <h3>Grupos que você participa</h3>

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
                  <button className="danger" onClick={() => excluirGrupo(grupo.id)}>
                    Excluir Grupo
                  </button>
                ) : (
                  <button className="danger" onClick={() => sairDoGrupo(grupo.id)}>
                    Sair do Grupo
                  </button>
                )}
              </div>
              
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default MeusGrupos;