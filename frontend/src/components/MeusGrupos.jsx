import { useState } from "react";

function MeusGrupos({ usuarioLogado, grupos, atualizarGrupos, abrirGrupo }) {
  const [tituloGrupo, setTituloGrupo] = useState("");
  const [codigoConvite, setCodigoConvite] = useState("");
  const [mensagem, setMensagem] = useState("");

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

      <div>
        {grupos.map((grupo) => (
          <div key={grupo.id}>
            <h4>{grupo.titulo}</h4>
            <p>Código: {grupo.codigoConvite}</p>
            
            {grupo.criadoPor && (
              <p>Criado por: {grupo.criadoPor.nome}</p>
            )}
            
            <button onClick={() => abrirGrupo(grupo)}>Abrir Grupo</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MeusGrupos;