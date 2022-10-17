import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from 'src/models/user.model'
import { ACC_TYPE } from 'src/utils/AccType'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly UserModel: Model<UserDocument>) {}

  async changeAccountType(user: UserDocument) {
    const currentType = user.type

    if (currentType === ACC_TYPE.PUBLIC) user.type = ACC_TYPE.PRIVATE
    else user.type = ACC_TYPE.PUBLIC
    await user.save()

    return user.type
  }

  async updatePhoneNumber(user: UserDocument, number: number) {
    user.phoneNumber = number
    await user.save()

    return user.phoneNumber
  }
}
