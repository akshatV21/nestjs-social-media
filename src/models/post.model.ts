import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { User } from './user.model'

export type PostDocument = Post & Document

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, ref: 'User' })
  user: Types.ObjectId

  @Prop({ required: true })
  media: Types.ObjectId

  @Prop({ default: '' })
  caption: string

  @Prop({ default: [], ref: 'User' })
  likes: User[]

  @Prop({ default: [], ref: 'Comment' })
  comments: []
}

export const PostSchema = SchemaFactory.createForClass(Post)
