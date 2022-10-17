import { IsPhoneNumber } from '@nestjs/class-validator'
import { IsNotEmpty } from 'class-validator'

export class PhoneNumber {
  @IsNotEmpty()
  @IsPhoneNumber('IN')
  number: string
}
