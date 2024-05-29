import bcryptjs from "bcryptjs";

const users = [
    {
        user: "Ricardo",
        email: "ricardo@gmail.com",
        password: "Ricardo"
    },
    {
        user: "Miguel",
        email: "miguel@gmail.com",
        password: "Miguel"
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
                message:"Error al iniciar sesión"
            }
        ); //No existe el usuario
    }
    
    const correctLogin = await bcryptjs.compare(password, userExists.password);    
    console.log(correctLogin);
    if(!correctLogin){
        return res.status(400).send(
            {
                status:"Error", 
                message:"Error al iniciar sesión"
            }
        ); //Contraseña incorrecta
    }
}

async function register(req, res){
    console.log(req.body);
    const user = req.body.user;
    const email = req.body.email;
    const password = req.body.password;

    if(!user || !password || !email){
        return res.status(400).send({status:"Error", message:"Campos incompletos"});
    }

    const userExists = users.find(u => u.user === user);
    if(userExists){
        return res.status(400).send({status:"Error", message:"El usuario ya existe"});
    }

    const salt = await bcryptjs.genSalt(5);
    const hashedPassword = await bcryptjs.hash(password, salt); // Hashea distinto cada que vez que alguien se registra
    const newUser = {
        user, email, password: hashedPassword 
    }
    users.push(newUser);
    return res.status(201).send({status: "ok", message: `Usuario ${newUser.user} agregado`, redirect:"/"})
}

export const methods = {
    login,
    register
}