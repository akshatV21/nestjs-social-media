import { Controller, Post, Body, Get, Param } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/Auth.decorator'
import { ReqUser } from 'src/auth/decorators/ReqUser.decorator'
import { CommentsService } from './comments.service'
import { CreateComment } from './dtos/CreateComment.dto'
import { ReplyComment } from './dtos/ReplyComment.dto'

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @Auth()
  async httpCreateNewComment(@Body() commentPayload: CreateComment, @ReqUser() userId: string) {
    const comment = await this.commentsService.create(commentPayload, userId)
    return { success: true, message: 'Comment created successfully', comment: comment }
  }

  @Post('reply')
  @Auth()
  async httpCreateReplyComment(@Body() commentPayload: ReplyComment, @ReqUser() userId: string) {
    const comment = await this.commentsService.reply(commentPayload, userId)
    return { success: true, message: 'Comment created successfully', comment: comment }
  }

  @Get(':id')
  @Auth()
  async httpGetPostComments(@Param('id') id: string) {
    const comments = await this.commentsService.getPostComments(id)
    return { success: true, message: 'Comments fetched successfully', comments: comments }
  }
}
