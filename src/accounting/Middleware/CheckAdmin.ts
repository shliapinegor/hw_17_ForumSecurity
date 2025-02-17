import {ExpressMiddlewareInterface} from "routing-controllers";

export class CheckAdmin implements ExpressMiddlewareInterface{
    use(request: any, response: any, next: (err?: any) => any): any {
        const access = request.user.roles.includes('admin')
        if(!access){
            response.status(401).send('Access denied. Only admin and owner have permission')
        }
    }
}