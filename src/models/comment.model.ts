import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type CommentDocument = Comment & Document

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true, ref: 'User' })
  user: Types.ObjectId

  @Prop({ required: true, ref: 'Post' })
  post: Types.ObjectId

  @Prop({ required: true })
  text: string

  @Prop({ default: null, ref: 'Comment' })
  parent: Types.ObjectId

  @Prop({ default: [], ref: 'Comment' })
  replies: Comment[]
}

export const CommentSchema = SchemaFactory.createForClass(Comment)
