import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { timeStamp } from "console";
import handlebars from "express-handlebars";
import bodyParser from "body-parser";
import userRoutes from "./src/routes/userRoutes.ts";


//definido path e __dirname
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

//configuração do handlebars
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "src", "views"));

//configuração do body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", userRoutes);
app.use("/usuarios", userRoutes);
app.use("/usuario/:id", userRoutes);
app.use("/novoUser", userRoutes);
app.use("/cadUser", userRoutes);
app.use("/alteraUser", userRoutes);
app.use("/deletaUser", userRoutes);

//rota 404 - página não encontrada
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "public", "html", "404.html"));
  console.log("404 - Página Não Encontrada");
});

app.listen(3000, () => {
  console.log("Servidor rodando no site: http://localhost:3000");
});
