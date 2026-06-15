import { useState } from "react";
import { API_URL } from "../config";

function Login({ onLogin, irParaCadastro }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function fazerLogin(event) {
    event.preventDefault();

    fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        senha: senha,
      }),
    })
      .then((resposta) => resposta.json())
      .then((dados) => {
        if (!dados.sucesso) {
          setErro(dados.mensagem);
          return;
        }

        onLogin(dados.usuario);
      })
      .catch((erro) => {
        console.error("Erro ao fazer login:", erro);
        setErro("Erro ao conectar com o servidor");
      });
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={fazerLogin}>
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

        <button type="submit">Entrar</button>
        <button type="button" onClick={irParaCadastro}>
          Criar conta
        </button>
      </form>

      {erro && <p>{erro}</p>}
    </div>
  );
}

export default Login;