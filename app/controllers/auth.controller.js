import bcryptjs from "bcryptjs";

const users = [{
    user: "Ricardo",
    email: "ricardo@gmail.com",
    password: "Ricardo"
}];

async function login(req, res){
    console.log(req.body);
    const user = req.body.user;
    const password = req.body.password;
    
    if(!user || !password){
        return res.status(400).send({status:"Error", message:"Campos incompletos"});
    }
    
    const userReview = users.find(u => u.user === user);
    if(!userReview){
        return res.status(400).send({status:"Error", message:"Error al iniciar sesión"});
    }
    
    const correctLogin = await bcryptjs.compare(password, userReview.password);    
    console.log(correctLogin);
}

async function register(req, res){
    console.log(req.body);
    const user = req.body.user;
    const email = req.body.email;
    const password = req.body.password;

    if(!user || !password || !email){
        return res.status(400).send({status:"Error", message:"Campos incompletos"});
    }

    const userReview = users.find(u => u.user === user);
    if(userReview){
        return res.status(400).send({status:"Error", message:"El usuario ya existe"});
    }

    const salt = await bcryptjs.genSalt(5);
    const hashedPassword = await bcryptjs.hash(password, salt); // Hashea distinto cada que vez que alguien se registra
    const newUser = {
        user, email, password: hashedPassword
    }
    users.push(newUser);
    // console.log(users);
    return res.status(201).send({status: "ok", message: `Usuario ${newUser.user} agregado`, redirect:"/"})
}

export const methods = {
    login,
    register
}