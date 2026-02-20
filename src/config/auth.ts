import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import user from "../models/user.ts";

// 🔹 Estratégia local (email + senha)
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "senha",
    },
    async (email, senha, done) => {
      try {
        const usuario = await user.findOne({
          where: { emailUsuario: email },
        });

        if (!usuario) {
          return done(null, false, { message: "Usuário não encontrado" });
        }

        if (usuario.dataValues.senhaUsuario !== senha) {
          return done(null, false, { message: "Senha incorreta" });
        }

        return done(null, usuario);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// 🔹 Salvar usuário na sessão
passport.serializeUser((usuario: any, done) => {
  done(null, usuario.idUsuario);
});

// 🔹 Recuperar usuário da sessão
passport.deserializeUser(async (id: number, done) => {
  try {
    const usuario = await user.findByPk(id);
    done(null, usuario);
  } catch (error) {
    done(error);
  }
});

export default passport;
