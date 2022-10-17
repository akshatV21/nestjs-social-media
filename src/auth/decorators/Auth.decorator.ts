import { SetMetadata } from '@nestjs/common'

export const Auth = (options: { user?: boolean; isOpen?: boolean } = {}) => {
  const metadata = {
    user: options.user ?? false,
    isOpen: options.isOpen ?? false,
  }
  return SetMetadata('options', metadata)
}
