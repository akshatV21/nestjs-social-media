import { IsNotEmpty } from 'class-validator'

export class Caption {
  @IsNotEmpty()
  caption: string
}
