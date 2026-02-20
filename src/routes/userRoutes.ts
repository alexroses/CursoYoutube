import { Router } from "express";
import passport from "passport";
import { verificaUser } from "../helpers/verificaUser.ts";

import {
  principal,
  listar,
  visualizar,
  novo,
  cadastrar,
  alterar,
  excluir,
  pesquisar,
  logar,
} from "../controllers/userController.ts";

const router = Router();

router.get("/", principal);
router.get("/usuarios", verificaUser, listar);
router.get("/usuario/:id", verificaUser, visualizar);
router.get("/novoUser", verificaUser, novo);
router.post("/cadUser", verificaUser, cadastrar);
router.post("/alteraUser", verificaUser, alterar);
router.post("/deletaUser", verificaUser, excluir);
router.get("/pesquisaUser", verificaUser, pesquisar);
router.get("/login", logar);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err: Error | null, user: any, info: any) => {
    if (err) return next(err);

    // ❌ Se falhar
    if (!user) {
      req.flash("error_msg", info.message);
      return res.redirect("/login");
    }

    // ✅ Se sucesso
    req.logIn(user, (err) => {
      if (err) return next(err);

      req.flash("success_msg", "Login realizado com sucesso!");

      return res.redirect("/");
    });
  })(req, res, next);
});

export default router;
