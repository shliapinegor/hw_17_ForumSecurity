import {Roles} from "../utils/roles";

export function CheckRoleMiddleware(role: Roles) {
    return (request: any, response: any, next: (err?: any) => any) : any => {
        const access = request.user.roles.includes(role)
        if(!access){
            response.status(401).send(`Access denied. Only ${role} and owner have permission`)
        }
        next()
    }

}