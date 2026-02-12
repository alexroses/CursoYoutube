import { Sequelize, Model, DataTypes } from "sequelize";

const sequelize = new Sequelize(
  process.env.BANCO_DE_DADOS_NOME!,
  process.env.BANCO_DE_DADOS_USUARIO!,
  process.env.BANCO_DE_DADOS_SENHA,
  {
    host: process.env.BANCO_DE_DADOS_URL!,
    dialect: "mysql", // ou 'postgres', 'sqlite', 'mariadb', 'mssql'
  },
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
  })
  .catch((err) => {
    console.error("Não foi possível conectar ao banco de dados:", err);
  });

export default sequelize;
