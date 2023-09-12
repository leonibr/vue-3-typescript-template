export interface IProfile {
  name: string
  email: string
  avatar: string
  roles: string
}

export const defaultProfile: IProfile = {
  name: 'Loading...',
  email: 'Loading...',
  avatar: 'Loading...',
  roles: 'Loading...'
}
