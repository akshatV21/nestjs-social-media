import { IsNotEmpty } from '@nestjs/class-validator'

export class LoginPayload {
  @IsNotEmpty()
  username: string

  @IsNotEmpty()
  password: string
}
