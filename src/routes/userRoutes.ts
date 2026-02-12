import { Router } from "express";

import { principal, listar, visualizar, novo, cadastrar, alterar, excluir } from "../controllers/userController.ts";

const router = Router();

router.get("/", principal);
router.get("/usuarios", listar);
router.get("/usuario/:id", visualizar);
router.get("/novoUser", novo);
router.post("/cadUser", cadastrar);
router.post("/alteraUser", alterar);
router.post("/deletaUser", excluir);

export default router;



