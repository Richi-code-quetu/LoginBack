const users = [{
    user: "Ricardo",
    password: "Ricardo",
    email: "ricardo@gmail.com"
}]

async function login(req, res){

}

async function register(req, res){
    console.log(req.body);
    const user = req.body.user;
    const password = req.body.password;
    const email = req.body.email;

    if(!user || !password || !email){
        res.status(400).send({status:"Error", message:"Campos incompletos"});
    }

    const userReview = users.find(u => u.user === user);
    if(userReview){
        res.status(400).send({status:"Error", message:"El usuario ya existe"});
    }
}

export const methods = {
    login,
    register
}