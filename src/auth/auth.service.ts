import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { compareSync } from 'bcrypt'
import { User, UserDocument } from 'src/models/user.model'
import { LoginPayload } from './dtos/LoginPayload.dto'
import { RegisterPayload } from './dtos/RegisterPayload.dto'
import { sign } from 'jsonwebtoken'

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private readonly UserModel: Model<UserDocument>) {}

  async register(userPayload: RegisterPayload) {
    const user = new this.UserModel(userPayload)
    await user.save()
    return user
  }

  async login(userPayload: LoginPayload) {
    const registeredUser = await this.UserModel.findOne({ username: userPayload.username })
    if (!registeredUser) throw new HttpException('Invalid username', HttpStatus.BAD_REQUEST)

    const passwordMatches = compareSync(userPayload.password, registeredUser.password)
    if (!passwordMatches) throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST)

    const token = sign(registeredUser.id, 'akshat')
    const { password, ...rest } = registeredUser._doc

    return { ...rest, token: token }
  }

  async getUser(id: string) {
    const user = await this.UserModel.findById(id)
    return user
  }
}
