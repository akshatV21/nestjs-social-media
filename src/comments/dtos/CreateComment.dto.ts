import { IsNotEmpty } from '@nestjs/class-validator'

export class CreateComment {
  @IsNotEmpty()
  post: string

  @IsNotEmpty()
  text: string
}
