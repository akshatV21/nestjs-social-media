import { Controller, Post, Body } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/Auth.decorator'
import { ReqUser } from 'src/auth/decorators/ReqUser.decorator'
import { CommentsService } from './comments.service'
import { CreateComment } from './dtos/CreateComment.dto'

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @Auth()
  async httpCreateNewComment(@Body() commentPayload: CreateComment, @ReqUser() userId: string) {
    const comment = await this.commentsService.create(commentPayload, userId)
    return { success: true, message: 'Comment created successfully', comment: comment }
  }
}
