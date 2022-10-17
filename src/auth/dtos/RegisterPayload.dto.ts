import { IsNotEmpty } from '@nestjs/class-validator'

export class RegisterPayload {
  @IsNotEmpty()
  username: string

  @IsNotEmpty()
  password: string

  @IsNotEmpty()
  email: string
}
