import session from "express-session";

export default session({
  secret: process.env.SESSION_SECRET || "chave_super_secreta",
  resave: false,
  saveUninitialized: false,
  rolling: false,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hora
  },
});
