import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common'

@Injectable()
export class DoesNotFollows implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const user = req.user
    const userToFollowId = req.params.id

    if (user.followings.includes(userToFollowId)) throw new BadRequestException('You already have followed this user')
    return true
  }
}
