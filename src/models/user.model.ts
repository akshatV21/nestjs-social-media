import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { hashSync } from 'bcrypt'
import { ACC_TYPE } from 'src/utils/AccType'
import { Request } from './Request.mode'
import { Post } from './post.model'

export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username: string

  @Prop({ required: true })
  password: string

  @Prop({ required: true })
  email: string

  @Prop()
  dp: string

  @Prop({ default: [], ref: 'User' })
  followers: User[]

  @Prop({ default: [], ref: 'User' })
  followings: User[]

  @Prop({ default: [], ref: 'Request' })
  requests_sent: Request[]

  @Prop({ default: [], ref: 'Request' })
  requests_recieved: Request[]

  @Prop({ default: [], ref: 'Post' })
  posts: Post[]

  @Prop({ default: null })
  phoneNumber: number

  @Prop({ default: ACC_TYPE.PUBLIC })
  type: string

  _doc: any
}

const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()

  const hashedPassword = hashSync(this.password, 4)
  this.password = hashedPassword
  return next()
})

export { UserSchema }
