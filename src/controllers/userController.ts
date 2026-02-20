import { Request, Response } from "express";
import user from "../models/user.ts";

export const principal = async (req: Request, res: Response) => {
  let idlogin = req.user ? (req.user as any).idUsuario : null;
  let dadoslogin = await user.findByPk(idlogin);

  res.render("index", {
    cabecalho: true,
    hero: true,
    carrossel: true,
    beneficios: true,
    rodape: true,
    dadoslogin: dadoslogin || null,
    mensagem: req.flash("success_msg"),
    tipo: "success",
  });
};

export const listar = async (req: Request, res: Response) => {
  let dadosuser = await user.findAll({ raw: true });

  let idlogin = req.user ? (req.user as any).idUsuario : null;
  let dadoslogin = await user.findByPk(idlogin);

  dadosuser = dadosuser.map((item: any) => ({
    ...item,
    dnUsuario: item.dnUsuario
      ? new Date(item.dnUsuario).toLocaleDateString("pt-BR")
      : null,
  }));

  res.render("listaUser", {
    cabecalho: true,
    hero: false,
    carrossel: false,
    beneficios: false,
    rodape: true,
    dadosuser: dadosuser,
    dadoslogin: dadoslogin || null,
  });
};

export const visualizar = async (req: Request, res: Response) => {
  let id = Number(req.params.id);

  let dadosuser = await user.findByPk(id);

  let idlogin = req.user ? (req.user as any).idUsuario : null;
  let dadoslogin = await user.findByPk(idlogin);

  let categoria = dadosuser?.dataValues.categoriaUsuario.toString() || "";

  res.render("usuario", {
    cabecalho: true,
    hero: false,
    carrossel: false,
    beneficios: false,
    rodape: true,
    dadosuser: JSON.parse(JSON.stringify(dadosuser)),

    dadoslogin: dadoslogin || null,
  });
};

export const novo = async (req: Request, res: Response) => {
  let idlogin = req.user ? (req.user as any).idUsuario : null;
  let dadoslogin = await user.findByPk(idlogin);

  res.render("novoUser", {
    cabecalho: true,
    hero: false,
    carrossel: false,
    beneficios: false,
    rodape: true,
    dadoslogin: dadoslogin || null,
  });
};

export const cadastrar = async (req: Request, res: Response) => {
  let usuario = req.body.nome;

  let email = req.body.email;

  let dn = req.body.dn;

  let categoria = req.body.categ;
  categoria = parseInt(categoria);
  console.log("Categoria do usuário recebida:", categoria, typeof categoria);

  let senha = "123456";

  let mensagem: string = "";
  let tipo: string = "";

  let idlogin = req.user ? (req.user as any).idUsuario : null;
  let dadoslogin = await user.findByPk(idlogin);

  let dadosuser = await user.findOne({
    where: { nomeUsuario: usuario },
  });

  if (dadosuser) {
    mensagem = "Usuário já cadastrado";
    tipo = "danger";

    res.render("cadUser", {
      cabecalho: true,
      hero: false,
      carrossel: false,
      beneficios: false,
      rodape: true,
      dadosuser: dadosuser.dataValues,
      mensagem: mensagem,
      tipo: tipo,

      dadoslogin: dadoslogin || null,
    });

    return;
  }

  let dadosemail = await user.findOne({ where: { emailUsuario: email } });
  if (dadosemail) {
    mensagem = "Email já cadastrado";
    tipo = "danger";

    res.render("cadUser", {
      cabecalho: true,
      hero: false,
      carrossel: false,
      beneficios: false,
      rodape: true,
      dadosuser: dadosemail.dataValues,
      mensagem: mensagem,
      tipo: tipo,

      dadoslogin: dadoslogin || null,
    });

    return;
  }

  if (!dadosuser && !dadosemail) {
    let newUser = await user
      .create({
        nomeUsuario: req.body.nome,
        emailUsuario: req.body.email,
        dnUsuario: req.body.dn,
        categoriaUsuario: parseInt(req.body.categ),
        senhaUsuario: senha,
      })
      .then(function () {
        mensagem = "Usuário cadastrado com sucesso!";
        tipo = "success";
      })
      .catch(function (error) {
        mensagem = "Erro ao cadastrar usuário: " + error.message;
        tipo = "danger";
      });

    res.render("novoUser", {
      cabecalho: true,
      hero: false,
      carrossel: false,
      beneficios: false,
      rodape: true,
      mensagem: mensagem,
      tipo: tipo,
      dadoslogin: dadoslogin || null,
    });
  }
};

export const alterar = async (req: Request, res: Response) => {
  let id = req.body.id;

  let usuario = req.body.nome;

  let email = req.body.email;

  let dn = req.body.dn;

  let categoria = parseInt(req.body.categ);

  let categSel = req.body.sel;

  let mensagem: string = "";
  let tipo: string = "";

  let idlogin = req.user ? (req.user as any).idUsuario : null;
  let dadoslogin = await user.findByPk(idlogin);

  let dadosuser = await user.findByPk(id);

  if (dadosuser) {
    if (
      dadosuser.dataValues.nomeUsuario === usuario &&
      dadosuser.dataValues.emailUsuario === email &&
      dadosuser.dataValues.dnUsuario === dn &&
      dadosuser.dataValues.categoriaUsuario === categoria
    ) {
      mensagem = "Nenhuma alteração foi feita!";
      tipo = "info";
    } else {
      try {
        await user.update(
          {
            nomeUsuario: usuario,
            emailUsuario: email,
            dnUsuario: dn,
            categoriaUsuario: categoria,
          },
          { where: { idUsuario: id } },
        );

        mensagem = "Usuário alterado com sucesso!";
        tipo = "success";
      } catch (error: any) {
        mensagem = "Erro ao alterar usuário: " + error.message;
        tipo = "danger";
      }
    }

    dadosuser = await user.findByPk(id);

    return res.render("usuario", {
      cabecalho: true,
      hero: false,
      carrossel: false,
      beneficios: false,
      rodape: true,
      dadosuser: JSON.parse(JSON.stringify(dadosuser)),

      mensagem: mensagem,
      tipo: tipo,
      dadoslogin: dadoslogin || null,
    });
  } else {
    return res.status(404).send("Usuário não encontrado");
  }
};

export const excluir = async (req: Request, res: Response) => {
  const id = req.body.id;

  if (!id) {
    return res.status(400).send("ID não recebido");
  }

  let mensagem = "";
  let tipo = "";

  let idlogin = req.user ? (req.user as any).idUsuario : null;
  let dadoslogin = await user.findByPk(idlogin);

  const usuario = await user.findByPk(id);

  if (!usuario) {
    return res.status(404).send("Usuário não encontrado");
  }

  if (dadoslogin?.dataValues.emailUsuario === usuario?.dataValues.emailUsuario) {
    mensagem = "Você não pode excluir seu próprio usuário!";
    tipo = "danger";
    return res.render("usuario", {
      cabecalho: true,
      hero: false,
      carrossel: false,
      beneficios: false,
      rodape: true,
      dadosuser: usuario.dataValues,
      mensagem: mensagem,
      tipo: tipo,
      dadoslogin: dadoslogin || null,
    });
  }

  try {
    await user.destroy({ where: { idUsuario: id } });
    mensagem = "Usuário excluído com sucesso!";
    tipo = "success";
  } catch (error: any) {
    mensagem = "Erro ao excluir usuário: " + error.message;
    tipo = "danger";
  }

  const dadosuser = await user.findAll({ raw: true });
  console.log("Dados dos usuários após exclusão:", dadosuser);

  return res.render("listaUser", {
    cabecalho: true,
    hero: false,
    carrossel: false,
    beneficios: false,
    rodape: true,
    dadosuser: dadosuser,
    mensagem: mensagem,
    tipo: tipo,
    dadoslogin: dadoslogin || null,
  });
};
function elseif(arg0: boolean) {
  throw new Error("Function not implemented.");
}

export const pesquisar = async (req: Request, res: Response) => {
  let dadosuser = await user.findAll({ raw: true });

  let idlogin = req.user ? (req.user as any).idUsuario : null;
  let dadoslogin = await user.findByPk(idlogin);

  res.render("usuario", {
    cabecalho: true,
    busca: true,
    hero: false,
    carrossel: false,
    beneficios: false,
    rodape: true,
    dadosuser: dadosuser,
    dadoslogin: dadoslogin || null,
  });
};

export const logar = async (req: Request, res: Response) => {
  res.render("index", {
    cabecalho: true,
    hero: true,
    carrossel: true,
    beneficios: true,
    rodape: true,
    mensagem: req.flash("error"),
    tipo: "danger",
  });
};

export const sair = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      req.flash("error_msg", "Erro ao sair");
      return res.redirect("/");
    }

    req.flash("success_msg", "Usuário deslogado saiu com sucesso!");
    res.redirect("/");
  });
};