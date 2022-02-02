export interface ILoginCredentialsDto {
	email: string
	password: string
}

export interface ILoginResponseDto {
	loggedInUserId: string
	token: string
}
