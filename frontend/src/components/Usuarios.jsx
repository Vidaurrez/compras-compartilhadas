function Usuarios({ usuarios }) {
  return (
    <section>
      <h2>Usuários</h2>

      <div>
        {usuarios.map((usuario) => (
          <div key={usuario.id}>
            <h3>{usuario.nome}</h3>
            <p>{usuario.email}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Usuarios;