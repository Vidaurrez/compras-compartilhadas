import { useEffect, useState } from "react";

function GrupoDetalhes({ grupo, voltar }) {
  const [listas, setListas] = useState([]);
  const [tituloLista, setTituloLista] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [membros, setMembros] = useState([]);

  function carregarListas() {
    fetch(`http://localhost:8080/grupos/${grupo.id}/listas`)
      .then((resposta) => resposta.json())
      .then((dados) => setListas(dados))
      .catch((erro) => {
        console.error("Erro ao buscar listas:", erro);
      });
  }

  function carregarMembros() {
    fetch(`http://localhost:8080/grupos/${grupo.id}/membros`)
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

    fetch("http://localhost:8080/listas", {
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

  return (
    <section>
      <button onClick={voltar}>Voltar</button>

      <h2>{grupo.titulo}</h2>
      <p>Código de convite: {grupo.codigoConvite}</p>

      {grupo.criadoPor && <p>Criado por: {grupo.criadoPor.nome}</p>}

      <h3>Membros do grupo</h3>

      {membros.length === 0 ? (
        <p>Nenhum membro encontrado.</p>
      ) : (
        <div>
          {membros.map((membro) => (
            <div key={`${membro.usuario.id}-${membro.grupo.id}`}>
              <p>{membro.usuario.nome}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={criarLista}>
        <h3>Criar Lista</h3>

        <input
          type="text"
          placeholder="Nome da lista"
          value={tituloLista}
          onChange={(event) => setTituloLista(event.target.value)}
        />

        <button type="submit">Criar Lista</button>
      </form>

      {mensagem && <p>{mensagem}</p>}

      <h3>Listas do grupo</h3>

      {listas.length === 0 ? (
        <p>Nenhuma lista criada ainda.</p>
      ) : (
        <div>
          {listas.map((lista) => (
            <div key={lista.id}>
              <h4>{lista.titulo}</h4>
              <p>Status: {lista.status}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default GrupoDetalhes;