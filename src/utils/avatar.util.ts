/**
 * @name getRandomAvatarUrl
 * @returns {string} Random avatar URL
 * @description Returs URL of random avatars from <https://robohash.org/>
 * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
 */
export function getRandomAvatarUrl() {
	const randomNumber = Math.floor(Math.random() * 1000000 + 1)
	const randomAvatarUrl = `https://robohash.org/${randomNumber}`
	return randomAvatarUrl
}
