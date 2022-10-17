import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { REQ_STATUS } from 'src/utils/RequestStatus'

export type RequestDocument = Request & Document

@Schema({ timestamps: true })
export class Request {
  @Prop({ required: true, ref: 'User' })
  from: Types.ObjectId

  @Prop({ required: true, ref: 'User' })
  to: Types.ObjectId

  @Prop({ default: REQ_STATUS.UNANSWERED })
  status: string
}

export const RequestSchema = SchemaFactory.createForClass(Request)
