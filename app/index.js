import express from "express";
//Dirname para leer la ruta
import path from 'path'; 
import {fileURLToPath} from 'url'; 
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { methods as auth } from "./controllers/auth.controller.js";
import { methods as authorization } from "./middlewares/authorization.js";
import cookieParser from "cookie-parser";

//Server
const app = express();
app.set("port", 4000);
app.listen(app.get("port"));
console.log("App listening in http://localhost/",app.get("port"));

//Config
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(cookieParser());

//Routes
app.get("/", authorization.publicOnly, (req, res) => res.sendFile(__dirname + "/pages/login.html"));
app.get("/register", authorization.publicOnly, (req, res) => res.sendFile(__dirname + "/pages/register.html"));
app.get("/login", (req, res) => res.sendFile(__dirname + "/pages/login.html"));
app.get("/admin", authorization.adminOnly, (req, res) => res.sendFile(__dirname + "/pages/admin/admin.html"));
app.post("/api/login", auth.login);
app.post("/api/register", auth.register);


