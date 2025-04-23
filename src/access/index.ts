import type { Access, AccessArgs } from 'payload'
import type { User } from '@/payload-types'

type isAuthenticated = (args: AccessArgs<User>) => boolean

export const anyone: Access = () => true
export const isAdmin: Access = ({ req: { user } }) => Boolean(user && user.role === 'admin')
// Admins are also editors
export const isEditor: Access = ({ req: { user } }) =>
  Boolean(user && (user.role === 'editor' || user.role === 'admin'))
export const authenticated: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user)
}
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
