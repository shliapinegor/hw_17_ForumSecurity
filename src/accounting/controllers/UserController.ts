import {Body, Controller, Delete, Get, HeaderParam, Param, Post, Put, Res, UseBefore} from "routing-controllers";
import NewUserDto from "../dto/NewUserDto";
import UserService from "../service/UserService";
import UserServiceImpl from "../service/UserServiceImpl";
import {Response} from 'express';
import {AuthMiddleware} from "../Middleware/AuthMiddleware";
import {CheckAdmin} from "../Middleware/CheckAdmin";
import {CheckUserPermission} from "../Middleware/CheckUserPermission";

@Controller('/account')
export default class UserController {

    userService: UserService = new UserServiceImpl();

    @Post("/register")
    async register(@Body() newUserDto: NewUserDto) {
        return this.userService.register(newUserDto);
    }

    @UseBefore(AuthMiddleware)
    @Post("/login")
    async login(@Body() loginDto: {login: string, password: string}, @Res() res: Response) {
       const token =  await this.userService.login(loginDto.login, loginDto.password)
           .catch((err: any) => res.status(401).send(err));
        return res.json({token})
    }
    @UseBefore(AuthMiddleware)
    @UseBefore(CheckAdmin)
    @UseBefore(CheckUserPermission)
    @Delete('/user/:login')
    async removeUserByLogin(@Param('login') login: string, @Res() res: Response) {
        return await this.userService.removeUserByLogin(login).catch((err: any) => res.status(404).send(err));
    }

    @UseBefore(AuthMiddleware)
    @Get('/user/:login')
    async getUserByLogin(@Param('login') login: string, @Res() res: Response) {
        return await this.userService.getUserByLogin(login).catch((err: any) => res.status(404).send(err));
    }
    @UseBefore(AuthMiddleware)
    @Get('/users')
    async getAllUser(@Res() res: Response) {
        return await this.userService.getAllUser().catch((err: any) => res.status(404).send(err));
    }
    @UseBefore(AuthMiddleware)
    @UseBefore(CheckUserPermission)
    @Put('/user/:login')
    async updateUser(@Param('login') login: string, @Body() updateUserDto: NewUserDto, @Res() res: Response) {
        return await this.userService.updateUser(login, updateUserDto.firstName, updateUserDto.lastName).catch((err: any) => res.status(404).send(err));
    }
    @UseBefore(AuthMiddleware)
    @UseBefore(CheckAdmin)
    @Put('/user/:login/role/:role')
    async addUserRole(@Param('login') login: string, @Param('role') role: string, @Res() res: Response) {
        return await this.userService.addUserRole(login, role).catch((err: any) => res.status(404).send(err));
    }
    @UseBefore(AuthMiddleware)
    @UseBefore(CheckAdmin)
    @Delete('/user/:login/role/:role')
    async removeRole(@Param('login') login: string, @Param('role') role: string, @Res() res: Response) {
        return await this.userService.removeRole(login, role).catch((err: any) => res.status(404).send(err));
    }

}