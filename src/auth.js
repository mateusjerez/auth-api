import jsonwebtoken from "jsonwebtoken";

export const PRIVATE_KEY = "123abc098";
export const user = {
    name: "Teste Qualquer",
    email: "teste@qualquer.com"
}

export function tokenValited(req, res, next) {
    const [_, token] = req.headers.authorization?.split(" ") || [' ', ' '];

    if(!token) return res.status(401).send("Access denied. No token provided");

    try {
        const payload = jsonwebtoken.verify(token, PRIVATE_KEY);
        const userIdFromToken = typeof payload !== "string" && payload.user;

        if(!user && userIdFromToken) return res.status(401).send("Access denied. Invalid token");

        req.headers["user"] = paylod.user;

        return next();
    }catch(err) {
        console.log(err);
        return res.status(401).send("Access denied. Invalid token");
    }
}