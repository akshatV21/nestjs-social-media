import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Comment, CommentDocument } from 'src/models/comment,model'
import { Post, PostDocument } from 'src/models/post.model'
import { CreateComment } from './dtos/CreateComment.dto'

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly CommentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private readonly PostModel: Model<PostDocument>,
  ) {}

  async create(commentPayload: CreateComment, userId: string) {
    const comment = new this.CommentModel({ ...commentPayload, user: userId })
    const post = await this.PostModel.findById(comment.post)

    post.comments.push(comment._id)
    await Promise.all([comment.save(), post.save()])
    return comment
  }
}
