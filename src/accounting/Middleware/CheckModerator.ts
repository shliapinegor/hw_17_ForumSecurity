import {ExpressMiddlewareInterface} from "routing-controllers";

export class CheckModerator implements ExpressMiddlewareInterface{
    use(request: any, response: any, next: (err?: any) => any): any {
        const access = request.user.roles.includes('moderator')
        if(!access){
            response.status(401).send('Access denied. Only moderator and owner have permission')
        }
    }
}