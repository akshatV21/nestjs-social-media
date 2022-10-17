import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { verify } from 'jsonwebtoken'
import { AuthService } from '../auth.service'

@Injectable()
export class Authorize implements CanActivate {
  constructor(private reflector: Reflector, private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // getting all the metadata
    const { user, isOpen } = this.reflector.get('options', context.getHandler())
    if (isOpen) return true

    const req = context.switchToHttp().getRequest()
    const authHeader = req.headers['authorization']
    if (!authHeader) throw new BadRequestException('Invalid authorization header')

    const token = authHeader.split(' ')[1]
    const id = this.verifyToken(token)

    if (user) {
      const user = await this.authService.getUser(id)
      req.user = user
    } else {
      req.user = id
    }

    return true
  }

  private verifyToken(token: string): any {
    return verify(token, 'akshat', (err, id) => {
      if (err) throw new BadRequestException('Invalid token')
      return id
    })
  }
}
