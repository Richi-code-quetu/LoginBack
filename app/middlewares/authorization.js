import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { users } from "../controllers/auth.controller.js";

dotenv.config();

function adminOnly(req, res, next){
    const logged = checkCookie(req);
    if(logged) return next();
    return res.redirect("/");
}

function publicOnly(req, res, next){
    const logged = checkCookie(req);
    if(!logged) return next();
    return res.redirect("/admin");
}

function checkCookie(req){
    try{
        const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
        console.log("COOKIE", cookieJWT);
        const decodedCookie = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
        console.log(decodedCookie);
        const userExists = users.find(u => u.user === decodedCookie.user);
        console.log(userExists);
        if(!userExists){
            return false;
        }
        return true;
    } catch {
        return false;
    }
}

export const methods = {
    adminOnly,
    publicOnly
}