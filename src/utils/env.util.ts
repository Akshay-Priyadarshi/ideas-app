/**
 * @name getEnv
 * @param {string} name Name of the environment variable
 * @returns {string} Value of the environment variable with specified name
 * @description Takes name of environment variable & returns the corresponding value
 * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
 */
export function getEnv(name: string): string | undefined {
	if (process.env[name] === undefined) {
		throw new Error(`${name} is not provided as environment variable`)
	}
	return process.env[name]
}
