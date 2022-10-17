import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class UserAccessPost implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest()
    const postId = req.params.id
    const user = req.user

    const postIdIsPresent = user.posts.includes(postId)
    if (!postIdIsPresent) throw new NotFoundException('Post does not exists')
    return true
  }
}
