import { Request, Response } from "express";
import user from "../models/user.ts";

export const principal = async (req: Request, res: Response) => {
    
    res.render("index", {
    cabecalho: true,
    hero: true,
    carrossel: true,
    beneficios: true,
    rodape: true,
  });
};


export const listar = async (req: Request, res: Response) => {

  let dadosuser = await user.findAll({ raw: true });

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
  });
};


export const visualizar = async (req: Request, res: Response) => {
  let id = Number(req.params.id);
  //console.log("ID recebido:", id); // Verifique se o ID está sendo recebido corretamente

  let dadosuser = await user.findByPk(id);

  //console.log("Dados do usuário:", dadosuser); // Verifique os dados do usuário antes de renderizar

  res.render("usuario", {
    cabecalho: true,
    hero: false,
    carrossel: false,
    beneficios: false,
    rodape: true,
    dadosuser: JSON.parse(JSON.stringify(dadosuser)),
  });
};

export const novo = async (req: Request, res: Response) => {
    res.render("novoUser", {
    cabecalho: true,
    hero: false,
    carrossel: false,
    beneficios: false,
    rodape: true,
    
  });
};
  
export const cadastrar = async (req: Request, res: Response) => {
  let usuario = req.body.nome;
  console.log("Nome do usuário recebido:", usuario); // Verifique se o nome do usuário está sendo recebido corretamente
  let email = req.body.email;
  console.log("Email do usuário recebido:", email); // Verifique se o email do usuário está sendo recebido corretamente
  let dn = req.body.dn;
  console.log("Data de nascimento do usuário recebida:", dn);

  let mensagem: string = "";
  let tipo: string = "";

  let dadosuser = await user.findOne({
    where: { nomeUsuario: usuario },
  });

  console.log("Dados do usuário encontrado por nome:", dadosuser);

  if (dadosuser) {
    mensagem = "Usuário já cadastrado";
    tipo = "danger";
    console.log(mensagem);
    console.log("Dados do usuário para renderizar:", dadosuser);

    res.render("cadUser", {
      cabecalho: true,
      hero: false,
      carrossel: false,
      beneficios: false,
      rodape: true,
      dadosuser: dadosuser.dataValues,
      mensagem: mensagem,
      tipo: tipo,
    });

    return;
  }

  let dadosemail = await user.findOne({ where: { emailUsuario: email } });
  if (dadosemail) {
    mensagem = "Email já cadastrado";
    tipo = "danger";
    console.log(mensagem);

    res.render("cadUser", {
      cabecalho: true,
      hero: false,
      carrossel: false,
      beneficios: false,
      rodape: true,
      dadosuser: dadosemail.dataValues,
      mensagem: mensagem,
      tipo: tipo,
    });

    return;
  }

  if (!dadosuser && !dadosemail) {
    let newUser = await user
      .create({
        nomeUsuario: req.body.nome,
        emailUsuario: req.body.email,
        dnUsuario: req.body.dn,
      })
      .then(function () {
        mensagem = "Usuário cadastrado com sucesso!";
        tipo = "success";
      })
      .catch(function (error) {
        mensagem = "Erro ao cadastrar usuário: " + error.message;
        tipo = "danger";
      });
    console.log(mensagem);

    res.render("novoUser", {
      cabecalho: true,
      hero: false,
      carrossel: false,
      beneficios: false,
      rodape: true,
      mensagem: mensagem,
      tipo: tipo,
    });
  }
};

export const alterar = async (req: Request, res: Response) => {
  let id = req.body.id;
  console.log("ID do usuário recebido para alteração:", id); // Verifique se o ID do usuário está sendo recebido corretamente
  let usuario = req.body.nome;
  console.log("Nome do usuário recebido:", usuario); // Verifique se o nome do usuário está sendo recebido corretamente
  let email = req.body.email;
  console.log("Email do usuário recebido:", email); // Verifique se o email do usuário está sendo recebido corretamente
  let dn = req.body.dn;
  console.log("Data de nascimento do usuário recebida:", dn); // Verifique se a data de nascimento do usuário está sendo recebida corretamente

  let mensagem: string = "";
  let tipo: string = "";

  let dadosuser = await user.findByPk(id);

  if (dadosuser) {

    if (
      dadosuser.dataValues.nomeUsuario === usuario &&
      dadosuser.dataValues.emailUsuario === email &&
      dadosuser.dataValues.dnUsuario === dn
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
          },
          { where: { idUsuario: id } }
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

  const usuario = await user.findByPk(id);

  if (!usuario) {
    return res.status(404).send("Usuário não encontrado");
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
  });

};  

