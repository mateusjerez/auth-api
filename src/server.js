
import express from "express";
import jsonwebtoken from "jsonwebtoken";
import { PRIVATE_KEY, tokenValited, user } from "./auth.js";

const api = express();
api.use(express.json());

api.get("/", (_, res) => res.status(200).json({ message: "This is a public router..." }));

api.post("/login", (req, res) => {
    const [, hash] = req.headers.authorization?.split(" ") || [' ', ' '];
    const [email, password] = Buffer.from(hash, "base64").toString().split(":");

    try{
        const correctPassword = email === "teste@qualquer.com" && password === "123456"; //usuário e senha para exemplo.. 
        console.log(email, password);
        if(!correctPassword) return res.status(401).send("Access denied. Invalid credentials");

        const token = jsonwebtoken.sign(
            { user: JSON.stringify(user) },
            PRIVATE_KEY,
            { expiresIn: "60m" }
        )
        return res.status(200).json({ data: { user, token } });
    }catch(err) {
        console.log(err);
        return res.send(err);
    }
})
api.use('*', tokenValited)

api.get("/private", (req, res) => {
    const { user } = req.headers
    const currentUser = JSON.parse(user);
    return res.status(200).json({
        message: `This is a private router. Welcome ${currentUser.name}`,
        data: {
            userLogged: currentUser
        }
    })
})

api.listen(3000, () => console.log("Server is running on port 3000..."));
