import { useState } from "react";

function Cadastro({ onCadastro, voltarParaLogin }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function fazerCadastro(event) {
    event.preventDefault();

    fetch("http://localhost:8080/cadastro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, email, senha }),
    })
      .then((resposta) => resposta.json())
      .then((dados) => {
        if (!dados.sucesso) {
          setErro(dados.mensagem);
          return;
        }

        onCadastro(dados.usuario);
      })
      .catch((erro) => {
        console.error("Erro ao cadastrar:", erro);
        setErro("Erro ao conectar com o servidor");
      });
  }

  return (
    <div>
      <h1>Cadastro</h1>

      <form onSubmit={fazerCadastro}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
          />
        </div>

        <button type="submit">Cadastrar</button>
      </form>

      <button onClick={voltarParaLogin}>Voltar para Login</button>

      {erro && <p>{erro}</p>}
    </div>
  );
}

export default Cadastro;