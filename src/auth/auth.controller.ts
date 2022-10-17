import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Auth } from './decorators/Auth.decorator'
import { LoginPayload } from './dtos/LoginPayload.dto'
import { RegisterPayload } from './dtos/RegisterPayload.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Auth({ isOpen: true })
  @UsePipes(new ValidationPipe())
  async httpRegisterUser(@Body() userPayload: RegisterPayload) {
    const user = await this.authService.register(userPayload)
    return { success: true, message: 'User registered successfully!', user: user }
  }

  @Post('login')
  @Auth({ isOpen: true })
  @UsePipes(new ValidationPipe())
  async httpLoginUser(@Body() userPayload: LoginPayload) {
    const user = await this.authService.login(userPayload)
    return { success: true, message: 'User logged in successfully!', user: user }
  }
}
