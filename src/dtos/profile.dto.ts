import { IProfile } from '../database/profile.schema'

export type CreateProfileDto = IProfile

export type UpdateProfileDto = Partial<CreateProfileDto>
