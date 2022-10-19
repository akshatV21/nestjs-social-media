import { IsNotEmpty } from '@nestjs/class-validator'

export class ReplyComment {
  @IsNotEmpty()
  post: string

  @IsNotEmpty()
  parent: string

  @IsNotEmpty()
  text: string
}
