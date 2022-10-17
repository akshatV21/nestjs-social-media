import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  UseGuards,
  Patch,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Auth } from 'src/auth/decorators/Auth.decorator'
import { ReqUser } from 'src/auth/decorators/ReqUser.decorator'
import { User, UserDocument } from 'src/models/user.model'
import { Caption } from './dtos/Caption.dto'
import { UserAccessPost } from './guards/UserAccessPost.guard'
import { PostsService } from './posts.service'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('upload')
  @Auth({ user: true })
  @UseInterceptors(FileInterceptor('file'))
  async httpUploadPostMedia(@UploadedFile() media: Express.Multer.File, @ReqUser() user: UserDocument) {
    const post = await this.postsService.uploadMedia(media.id, user)
    return { success: true, message: 'Media upload successfully', post: post }
  }

  @Get(':id')
  @Auth({ user: true })
  @UseGuards(new UserAccessPost())
  async httpGetPost(@Param('id') id: string) {
    const post = await this.postsService.getPost(id)
    return { success: true, message: 'Post fetched successfully', post: post }
  }

  @Patch('caption/:id')
  @Auth({ user: true })
  @UseGuards(new UserAccessPost())
  @UsePipes(new ValidationPipe())
  async httpUpdateCaption(@Param('id') id: string, @Body() payload: Caption) {
    const caption = await this.postsService.updateCaption(id, payload.caption)
    return { success: true, message: 'Caption updated successfully', caption: caption }
  }

  @Patch('like/:id')
  @Auth()
  async httpProcessPostLike(@Param('id') id: string, @ReqUser() userId: User) {
    const likes = await this.postsService.like(userId, id)
    return { success: true, message: 'Likes updated successfully', likes: likes }
  }
}
