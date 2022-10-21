import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Comment, CommentDocument } from 'src/models/comment.model'
import { Post, PostDocument } from 'src/models/post.model'
import { CreateComment } from './dtos/CreateComment.dto'
import { ReplyComment } from './dtos/ReplyComment.dto'

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

  async reply(commentPayload: ReplyComment, userId: string) {
    const comment = new this.CommentModel({ ...commentPayload, user: userId })
    const parentComment = await this.CommentModel.findById(comment.parent)

    parentComment.replies.push(comment._id)
    await Promise.all([parentComment.save(), comment.save()])
    return comment
  }

  async getPostComments(id: string) {
    const comments = await this.CommentModel.find({ _id: id, parent: null }).populate('user', 'username dp')
    return comments
  }

  async getReplies(id: string) {
    const comment = await this.CommentModel.findById(id)
    const replies = await comment.populate({ path: 'replies', populate: { path: 'user', select: 'username dp' } })
    return replies
  }
}
