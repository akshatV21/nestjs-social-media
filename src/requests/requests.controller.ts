import { Controller, Param, Post, Patch, UseGuards } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/Auth.decorator'
import { ReqUser } from 'src/auth/decorators/ReqUser.decorator'
import { UserDocument } from 'src/models/user.model'
import { DoesNotFollows } from './guards/DoesNotFollows'
import { FollowsUser } from './guards/FollowsTheUser.guard'
import { RequestUnanswered } from './guards/RequestIdUnanswered.guard'
import { RequestsService } from './requests.service'

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post('follow/:id')
  @Auth({ user: true })
  @UseGuards(DoesNotFollows)
  async httpFollowUser(@ReqUser() user: UserDocument, @Param('id') id: string) {
    await this.requestsService.follow(user, id)
    return { success: true, message: 'Follow request sent successfully' }
  }

  @Patch('accept/:id')
  @Auth({ user: true })
  @UseGuards(RequestUnanswered)
  async acceptFollowRequest(@ReqUser() user: UserDocument, @Param('id') id: string) {
    const request = await this.requestsService.accpetRequest(user, id)
    return { success: true, message: 'Request accepted successfully', request: request }
  }

  @Patch('decline/:id')
  @Auth({ user: true })
  @UseGuards(RequestUnanswered)
  async declineFollowRequest(@ReqUser() user: UserDocument, @Param('id') id: string) {
    const request = await this.requestsService.declineRequest(user, id)
    return { success: true, message: 'Request declined successfully', request: request }
  }

  @Patch('unfollow/:id')
  @Auth({ user: true })
  @UseGuards(FollowsUser)
  async unfollowUser(@ReqUser() user: UserDocument, @Param('id') id: string) {
    await this.requestsService.unfollow(user, id)
    return { success: true, message: 'Successfully unfollowed user' }
  }
}
