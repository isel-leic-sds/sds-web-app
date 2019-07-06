/**
 * See: https://github.com/luke-park/SecureCompatibleEncryptionExamples/blob/master/JavaScript/SCEE-Node.js
 */
'use strict'
const crypt = require('crypto')

module.exports = crypto

const ALGORITHM_NAME = "aes-128-gcm";
const ALGORITHM_NONCE_SIZE = 12;
const ALGORITHM_TAG_SIZE = 16;
const ALGORITHM_KEY_SIZE = 16;
const PBKDF2_NAME = "sha1";
const PBKDF2_SALT_SIZE = 16;
const PBKDF2_ITERATIONS = 32767;

const CRYPTO_KEY = "SDS_ISEL_P3_G21_1819v"

function crypto() {

    return {
        encrypt: encrypt,
        decrypt: decrypt
    }

    function encrypt(plaintext) {
        function encryptBuffer(text, key) {
            // Generate a 96-bit nonce using a CSPRNG.
            let nonce = crypt.randomBytes(ALGORITHM_NONCE_SIZE);

            // Create the cipher instance.
            let cipher = crypt.createCipheriv(ALGORITHM_NAME, key, nonce);

            // Encrypt and prepend nonce.
            let ciphertext = Buffer.concat([ cipher.update(text), cipher.final() ]);
            return Buffer.concat([ nonce, ciphertext, cipher.getAuthTag() ]);
        }

        // Generate a 128-bit salt using a CSPRNG.
        let salt = crypt.randomBytes(PBKDF2_SALT_SIZE);
        
        // Derive a key using PBKDF2.
        let key = crypt.pbkdf2Sync(Buffer.from(CRYPTO_KEY, "utf8"), salt, PBKDF2_ITERATIONS, ALGORITHM_KEY_SIZE, PBKDF2_NAME);
        
        // Encrypt and prepend salt.
        let ciphertextAndNonceAndSalt = Buffer.concat([salt, encryptBuffer(Buffer.from(plaintext, "utf8"), key)]);
        return ciphertextAndNonceAndSalt.toString("base64");
    }

    function decrypt(base64CiphertextAndNonceAndSalt) {
        function decryptCypherAndNonce(ciphertextAndNonce, key) {
            // Create buffers of nonce, ciphertext and tag.
            let nonce = ciphertextAndNonce.slice(0, ALGORITHM_NONCE_SIZE);
            let ciphertext = ciphertextAndNonce.slice(ALGORITHM_NONCE_SIZE, ciphertextAndNonce.length - ALGORITHM_TAG_SIZE);
            let tag = ciphertextAndNonce.slice(ciphertext.length + ALGORITHM_NONCE_SIZE);
            
            // Create the cipher instance.
            let cipher = crypt.createDecipheriv(ALGORITHM_NAME, key, nonce);

            // Decrypt and return result.
            cipher.setAuthTag(tag);
            return Buffer.concat([ cipher.update(ciphertext), cipher.final() ]);
        }

        // Decode the base64.
        let ciphertextAndNonceAndSalt = Buffer.from(base64CiphertextAndNonceAndSalt, "base64");
        
        // Create buffers of salt and ciphertextAndNonce.
        let salt = ciphertextAndNonceAndSalt.slice(0, PBKDF2_SALT_SIZE);
        let ciphertextAndNonce = ciphertextAndNonceAndSalt.slice(PBKDF2_SALT_SIZE);
        
        // Derive the key using PBKDF2 and decrypt.
        let key = crypt.pbkdf2Sync(Buffer.from(CRYPTO_KEY, "utf8"), salt, PBKDF2_ITERATIONS, ALGORITHM_KEY_SIZE, PBKDF2_NAME);
        return decryptCypherAndNonce(ciphertextAndNonce, key).toString("utf8");
    }
}