import { DataTypes } from "sequelize";
import sequelize from "../conectaBanco.ts";

export const user = sequelize.define(
  "usuarios",
  {
    idUsuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nomeUsuario: {
      type: DataTypes.STRING,
    },
    emailUsuario: {
      type: DataTypes.STRING,
    },
    dnUsuario: {
      type: DataTypes.DATE,
    },
    senhaUsuario: {
      type: DataTypes.STRING,
    },
    categoriaUsuario: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
  },
);

export default user;
