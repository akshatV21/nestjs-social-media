import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserDocument } from 'src/models/user.model'

export const ReqUser = createParamDecorator((data: unknown, ctx: ExecutionContext): UserDocument => {
  const request = ctx.switchToHttp().getRequest()
  return request.user
})
