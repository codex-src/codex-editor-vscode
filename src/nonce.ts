// Generates a nonce ID.
function nonce(): string {
	let nonceID = ""
	const base = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	for (let x = 0; x < 32; x++) {
		nonceID += base.charAt(Math.floor(Math.random() * base.length))
	}
	return nonceID
}

export default nonce
