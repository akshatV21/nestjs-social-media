import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Request, RequestDocument } from 'src/models/Request.mode'
import { User, UserDocument } from 'src/models/user.model'
import { ACC_TYPE } from 'src/utils/AccType'
import { REQ_STATUS } from 'src/utils/RequestStatus'

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(Request.name) private readonly RequestModel: Model<RequestDocument>,
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
  ) {}

  // following a user
  async follow(user: UserDocument, userToFollowId: string) {
    const userToFollow = await this.UserModel.findById(userToFollowId)
    if (!userToFollow) throw new BadRequestException('Invalid user to follow')

    if (userToFollow.type === ACC_TYPE.PRIVATE) await this.followPrivateUser(user, userToFollow)
    else await this.followPublicUser(user, userToFollow)
  }

  // for public user
  private async followPrivateUser(user: UserDocument, userToFollow: UserDocument) {
    const followRequest = new this.RequestModel({ from: user._id, to: userToFollow._id })
    user.requests_sent.push(followRequest._id)
    userToFollow.requests_recieved.push(followRequest._id)
    await Promise.all([user.save(), userToFollow.save(), followRequest.save()])
  }

  // for private user
  private async followPublicUser(user: UserDocument, userToFollow: UserDocument) {
    user.followings.push(userToFollow._id)
    userToFollow.followers.push(user._id)
    await Promise.all([user.save(), userToFollow.save()])
  }

  // accepting a follow request
  async accpetRequest(user: UserDocument, requestId: string) {
    const request = await this.getFollowRequest(requestId)
    const userRequestTo = await this.UserModel.findById(request.to)
    const { requestSentIndex, requestRecievedIndex } = this.getRequestIndexes(user, request, userRequestTo)

    request.status = REQ_STATUS.ACCEPTED
    user.requests_sent.splice(requestSentIndex, 1)
    userRequestTo.requests_recieved.splice(requestRecievedIndex, 1)
    user.followings.push(userRequestTo._id)
    userRequestTo.followers.push(user._id)

    await Promise.all([request.save(), user.save(), userRequestTo.save()])
    return request
  }

  // declining a follow request
  async declineRequest(user: UserDocument, requestId: string) {
    const request = await this.getFollowRequest(requestId)
    const userRequestTo = await this.UserModel.findById(request.to)
    const { requestSentIndex, requestRecievedIndex } = this.getRequestIndexes(user, request, userRequestTo)

    request.status = REQ_STATUS.DECLINED
    user.requests_sent.splice(requestSentIndex, 1)
    userRequestTo.requests_recieved.splice(requestRecievedIndex, 1)

    await Promise.all([request.save(), user.save(), userRequestTo.save()])
    return request
  }

  async unfollow(user: UserDocument, userToUnfollowId: string) {
    const userToUnfollow = await this.UserModel.findById(userToUnfollowId)
    if (!userToUnfollow) throw new BadRequestException('Invalid user id')

    const { followingIndex, followerIndex } = this.getFollowIndexes(user, userToUnfollow)

    user.followings.splice(followingIndex, 1)
    userToUnfollow.followers.splice(followerIndex, 1)

    await Promise.all([user.save(), userToUnfollow.save()])
  }

  private getFollowIndexes(user: UserDocument, userToUnfollow: UserDocument) {
    const followingIndex = user.followings.findIndex(currUser => currUser === userToUnfollow._id)
    const followerIndex = userToUnfollow.followers.findIndex(currUser => currUser === user._id)
    return { followingIndex, followerIndex }
  }

  // getting request indexes
  private getRequestIndexes(user: UserDocument, request: RequestDocument, userRequestTo: UserDocument) {
    const requestSentIndex = user.requests_sent.findIndex(req => req === request._id)
    const requestRecievedIndex = userRequestTo.requests_recieved.findIndex(req => req === request._id)
    return { requestSentIndex, requestRecievedIndex }
  }

  async getFollowRequest(id: string) {
    const followRequest = await this.RequestModel.findById(id)
    return followRequest
  }
}
