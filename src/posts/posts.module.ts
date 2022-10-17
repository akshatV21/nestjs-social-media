import { Module } from '@nestjs/common'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/models/user.model'
import { Post, PostSchema } from 'src/models/post.model'
import { MulterModule } from '@nestjs/platform-express'
import { GridFsMulterConfigService } from 'src/multer/multer.config'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
    ]),
    MulterModule.registerAsync({ useClass: GridFsMulterConfigService }),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
