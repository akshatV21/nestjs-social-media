import { Module } from '@nestjs/common'
import { RequestsService } from './requests.service'
import { RequestsController } from './requests.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Request, RequestSchema } from 'src/models/Request.mode'
import { User, UserSchema } from 'src/models/user.model'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Request.name, schema: RequestSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
