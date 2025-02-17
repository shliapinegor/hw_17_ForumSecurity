import {ExpressMiddlewareInterface} from "routing-controllers";
import jwt, {JwtPayload} from "jsonwebtoken";


export class AuthMiddleware implements ExpressMiddlewareInterface {
    async use(request: any, response: any, next: (err?: any) => any): Promise<any> {
        const token = request.headers["authorization"];
        if (!token) {
            response.status(401).send("Access denied");
        }
        const jwtToken =( token.split(' '))[1]
        try {
            // const {login, roles} = jwt.verify(jwtToken, process.env.JWT_SECRET!) as JwtPayload;
            // const user = await User.findOne({login});
            // if(!user){
            //     response.status(403).send('Invalid token')
            // }
            // request.user = {login, roles}
            request.user = jwt.verify(jwtToken, process.env.JWT_SECRET!) as JwtPayload;
            // console.log(request.user)
            next();
        } catch (err){
            response.status(403).send('Invalid token')
        }



    }
}