import {Body, Controller, Delete, Get, Param, Post, Put, Res, UseBefore} from "routing-controllers";
import NewPostDto from "../dto/NewPostDto";
import PostService from "../service/PostService";
import PostServiceImpl from "../service/PostServiceImpl";
import {Response} from 'express';
import CommentDto from "../dto/CommentDto";
import {AuthMiddleware} from "../../accounting/Middleware/AuthMiddleware";
import {CheckUserPermission} from "../../accounting/Middleware/CheckUserPermission";
import {CheckRoleMiddleware} from "../../accounting/Middleware/CheckRoleMiddleware";
import {Roles} from "../../accounting/utils/roles";

@Controller('/forum')
export default class PostController {

    postService:PostService = new PostServiceImpl();

    @UseBefore(AuthMiddleware, CheckUserPermission)
    @Post("/post/:author")
    async createPost(@Param('author') author:string, @Body() newPostDto: NewPostDto){
        return await this.postService.createPost(author,newPostDto.title , newPostDto.content, newPostDto.tags);
    }

    @UseBefore(AuthMiddleware)
    @Get("/post/:id")
    async findPostById(@Param('id') id:string, @Res() res: Response){
        return await this.postService.findPostById(id).catch(err => res.status(404).send(err));
    }
    @UseBefore(AuthMiddleware, CheckUserPermission)
    @Put("/post/:id")
    async updatePostById(@Param('id') id:string, @Body() newPostDto: NewPostDto, @Res() res: Response){
        return await this.postService.updatePostById(id,newPostDto.title , newPostDto.content, newPostDto.tags).catch(err => res.status(404).send(err));
    }
    @UseBefore(AuthMiddleware, CheckUserPermission, CheckRoleMiddleware(Roles.MODERATOR))
    @Delete("/post/:id")
    async removePostById(@Param('id') id:string, @Res() res: Response){
        return await this.postService.removePostById(id).catch((err: any) => res.status(404).send(err));
    }
    @UseBefore(AuthMiddleware)
    @Get('/posts')
    async getAllPosts(@Res() res: Response) {
        return await this.postService.getAllPosts().catch((err: any) => res.status(404).send(err));
    }
    @UseBefore(AuthMiddleware)
    @Post('/posts/tags')
    async findPostsByTags(@Body() tags: string[]) {
        return await this.postService.findPostsByTags(tags);
    }
    @UseBefore(AuthMiddleware)
    @Post('/posts/period')
    async findPostsByPeriod(@Body() date: { dateFrom: string, dateTo: string }) {
        return await this.postService.findPostsByPeriod(new Date(date.dateFrom), new Date(date.dateTo));
    }
    @UseBefore(AuthMiddleware)
    @Get('/posts/author/:author')
    async findPostsByAuthor(@Param('author') author: string, @Res() res: Response) {
        return await this.postService.findPostsByAuthor(author).catch((err: any) => res.status(404).send(err));
    }
    @UseBefore(AuthMiddleware, CheckUserPermission)
    @Put('/post/:id/comment/:user')
    async addComment(@Param('id') id: string, @Param('user') user: string, @Body() commentDto: CommentDto, @Res() res: Response) {
        return await this.postService.addComment(id, user, commentDto.message).catch((err: any) => res.status(404).send(err));
    }
    @UseBefore(AuthMiddleware)
    @Put('/post/:id/like')
    async addLike(@Param('id') id: string, @Res() res: Response) {
        return await this.postService.addLike(id).catch((err: any) => res.status(404).send(err));
    }
}