import {ExpressMiddlewareInterface} from "routing-controllers";
import {decodeBase64} from "../utils/utilsForPassword";

export class CheckUserPermission implements ExpressMiddlewareInterface{
    async use(request: any, response: any, next: (err?: any) => any): Promise<any> {
        const loginFromRequest = request.params.login;
        if(loginFromRequest && request.user.login !== loginFromRequest){
            response.status(401).send('Access denied. Only owner have permission')
        }
        const authorFromRequest = request.params.author;
        if(authorFromRequest && authorFromRequest !== request.user.login){
            response.status(401).send('Access denied. Only author have permission')
        }
        next();
    }
}