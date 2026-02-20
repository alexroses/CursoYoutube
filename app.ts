import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { timeStamp } from "console";
import { hbsHelpers } from "./src/helpers/handlebarsHelpers.ts";
import bodyParser from "body-parser";
import sessionConfig from "./src/config/session.ts";
import flash from "connect-flash";
import handlebars from "express-handlebars";
import userRoutes from "./src/routes/userRoutes.ts";
import { flashMiddleware } from "./src/middlewares/flashMiddleware.ts";
import passport from "./src/config/auth.ts";

//definido path e __dirname
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

//configuração do handlebars
const hbs = handlebars.create({
  defaultLayout: "main",
  helpers: {
    json: function (context: any) {
      return JSON.stringify(context);
    },
    ...hbsHelpers,
  },
});

app.engine("handlebars", hbs.engine);

app.set("view engine", "handlebars");

app.set("views", path.join(__dirname, "src", "views"));

//configuração do body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Sessão
app.use(sessionConfig);

// Flash
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.usuarioLogado = req.user;
  next();
});

// Middleware para enviar mensagens para as views
app.use(flashMiddleware);

app.use("/", userRoutes);

//rota 404 - página não encontrada
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "public", "html", "404.html"));
  console.log("404 - Página Não Encontrada");
});

app.listen(3000, () => {
  console.log("Servidor rodando no site: http://localhost:3000");
});
