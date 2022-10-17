import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { MongoGridFS } from 'mongo-gridfs'
import { Connection, Model } from 'mongoose'
import { Post, PostDocument } from 'src/models/post.model'
import { User, UserDocument } from 'src/models/user.model'

@Injectable()
export class PostsService {
  private FileModel: MongoGridFS

  constructor(
    @InjectModel(Post.name) private readonly PostModel: Model<PostDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {
    this.FileModel = new MongoGridFS(this.connection.db, 'fs')
  }

  async uploadMedia(mediaId: string, user: UserDocument) {
    const post = new this.PostModel({ media: mediaId, user: user._id })
    user.posts.push(post._id)
    await Promise.all([user.save(), post.save()])
    return post
  }

  async updateCaption(id: string, caption: string) {
    const post = await this.PostModel.findById(id)
    post.caption = caption
    await post.save()
    return post.caption
  }

  async getPost(id: string) {
    const post = await this.PostModel.findById(id)
    return post
  }

  async like(userId: User, postId: string) {
    const post = await this.PostModel.findById(postId)
    if (!post) throw new NotFoundException('Post does not exists')

    const likeIndex = post.likes.findIndex(user => user === userId)
    if (likeIndex === -1) post.likes.push(userId)
    else post.likes.splice(likeIndex, 1)

    await post.save()
    return post.likes.length
  }
}
