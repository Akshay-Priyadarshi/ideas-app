// PUG CONSTANTS
export const PUBLIC_PATH = './public'
export const TEMPLATES_PATH = './public/templates/'

// SENDGRID CONSTANTS
export const VERIFY_EMAIL_TID = 'd-0f5bf41a67064f86a53774c86c92f903'
export const SENDER_MAIL = 'ideasiq.contact@gmail.com'

// BCRYPT
export const SALT_ROUNDS = 10

// User authorization leve
export const USER_AUTH_LEVEL = {
	ADMIN: 0,
	USER: 1,
}

// ENV VARIABLES
export const ENV_PORT = 'PORT'
export const ENV_ACCESS_TOKEN_SECRET = 'ACCESS_TOKEN_SECRET'
export const ENV_REFRESH_TOKEN_SECRET = 'REFRESH_TOKEN_SECRET'
export const ENV_DB_URL = 'DB_URL'
export const ENV_VERIFY_USER_SECRET = 'VERIFY_USER_SECRET'
export const ENV_SGMAIL_KEY = 'SGMAIL_KEY'

// DB MODELS
export const USER_MODEL_NAME = 'User'
export const IDEA_MODEL_NAME = 'Idea'
export const UPVOTE_MODEL_NAME = 'Upvote'
export const DOWNVOTE_MODEL_NAME = 'Downvote'
export const COMMENT_MODEL_NAME = 'Comment'
