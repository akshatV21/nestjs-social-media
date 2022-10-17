import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common'
import { Observable } from 'rxjs'
import { REQ_STATUS } from 'src/utils/RequestStatus'
import { RequestsService } from '../requests.service'

@Injectable()
export class RequestUnanswered implements CanActivate {
  constructor(private readonly requestsServer: RequestsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const requestId = req.params.id

    const followRequest = await this.requestsServer.getFollowRequest(requestId)
    if (!followRequest) throw new BadRequestException('Invalid follow request id')
    if (followRequest.status !== REQ_STATUS.UNANSWERED) throw new BadRequestException('Request already processed')

    req.followRequest = followRequest
    return true
  }
}
