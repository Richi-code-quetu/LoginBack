import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const users = [
    {
        user: "Ricardo",
        email: "ricardo@gmail.com",
        password: "$2a$05$jvzrxW77H3s.SWDdA/LELeomZcOUm6xMSj8.LPffVe3IEp.E8j8vO"
    },
    {
        user: "Natalia",
        email: "natalia@gmail.com",
        password: "$2a$05$HBkVrat0.2IPMZeLAaldBuoVvaN2aOuCVAgJ5iBEvnfEW1LXfT.gm"
    }
];

async function login(req, res){
    console.log(req.body);
    const user = req.body.user;
    const password = req.body.password;
    
    if(!user || !password){
        return res.status(400).send({status:"Error", message:"Campos incompletos"});
    }
    
    const userExists = users.find(u => u.user === user);
    if(!userExists){
        return res.status(400).send(
            {
                status:"Error", 
                message:"No existe este usuario"
            }
        ); //No existe el usuario
    }
    
    const correctLogin = await bcryptjs.compare(password, userExists.password);    
    console.log(correctLogin);
    if(!correctLogin){
        return res.status(400).send(
            {
                status:"Error", 
                message:"Contraseña incorrecta"
            }
        ); //Contraseña incorrecta
    }

    const token = jsonwebtoken.sign(
        {user: userExists.user}, 
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRATION}
    );// JSONWebToken.sign necesita un payload, una llave secreta y expiración

    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES *24 *60 *60 *1000),
        path: "/"
    } //La galleta permite darle el token al cliente para cada vez que se loggea

    res.cookie("jwt", token, cookieOption);
    res.send({status: "Ok", message: "Usuario loggeado", redirect: "/admin"});
}

async function register(req, res){
    const user = req.body.user;
    const email = req.body.email;
    const password = req.body.password;
    
    if(!user || !email || !password){
        return res.status(400).send({status:"Error", message:"Campos incompletos"});
    }
    
    const userExists = users.find(u => u.user === user);
    if(userExists){
        return res.status(400).send({status:"Error", message:"El usuario ya existe"});
    }
    
    const salt = await bcryptjs.genSalt(5); // Default es 10, es más seguro pero demora más
    const hashedPassword = await bcryptjs.hash(password, salt); // Hashea distinto cada que vez que alguien se registra
    const newUser = {
        user, email, password: hashedPassword 
    }
    users.push(newUser);
    console.log(newUser);
    console.log(users);
    return res.status(201).send({status: "ok", message: `Usuario ${newUser.user} agregado`, redirect:"/"});
}

export const methods = {
    register,
    login,
}