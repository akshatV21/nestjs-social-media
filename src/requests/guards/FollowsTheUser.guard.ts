import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class FollowsUser implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest()
    const user = req.user
    const userToUnfollowId = req.params.id

    if (!user.followings.includes(userToUnfollowId)) throw new BadRequestException('You do not follow this user')
    return true
  }
}
