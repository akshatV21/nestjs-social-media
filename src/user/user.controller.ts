import { Body, Controller, Patch, UsePipes, ValidationPipe } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/Auth.decorator'
import { ReqUser } from 'src/auth/decorators/ReqUser.decorator'
import { UserDocument } from 'src/models/user.model'
import { PhoneNumber } from './dtos/PhoneNumber.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('type')
  @Auth({ user: true })
  async changeAccountType(@ReqUser() user: UserDocument) {
    const type = await this.userService.changeAccountType(user)
    return { success: true, message: 'Account type changed successfully', type: type }
  }

  @Patch('phoneNumber')
  @Auth({ user: true })
  @UsePipes(new ValidationPipe())
  async updatePhoneNumber(@ReqUser() user: UserDocument, @Body() payload: PhoneNumber) {
    const phoneNumber = await this.userService.updatePhoneNumber(user, Number(payload.number))
    return { success: true, message: 'Phone number updated successfully', phoneNumber: phoneNumber }
  }
}
