import { SetMetadata } from '@nestjs/common'

export const Auth = (options?: { user?: boolean; isOpen?: boolean }) => SetMetadata('options', options)
