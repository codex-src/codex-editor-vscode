// Generates a new nonce ID.
function newNonce() {
	const base = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

	let nonce = ""
	for (let x = 0; x < 32; x++) {
		nonce += base.charAt(Math.floor(Math.random() * base.length))
	}
	return nonce
}

export default newNonce
