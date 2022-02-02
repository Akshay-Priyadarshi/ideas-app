/**
 * @returns {string} Random avatar Url
 * @description Returs url of random avatars from <https://robohash.org/>
 * @author Akshay Priyadarshi <akshayp1904@outlook.com>
 */
export function getRandomAvatarUrl() {
	const randomNumber = Math.floor(Math.random() * 1000000 + 1)
	const randomAvatarUrl = `https://robohash.org/${randomNumber}`
	return randomAvatarUrl
}
