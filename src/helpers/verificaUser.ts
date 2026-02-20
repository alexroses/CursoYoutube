export const verificaUser = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }

  

  req.flash("error_msg", "Você precisa estar logado para acessar esta página!");
  res.redirect("/login");
};
