# React Native Simple Crypto

A simpler React-Native crypto library

This is a fork of [react-native-crypto](https://github.com/pedrouid/react-native-simple-crypto)
which is a fork of [@trackforce/react-native-crypto](https://github.com/trackforce/react-native-crypto).

The reason for this fork is that crypto is at the core of the Egendata
platform which is built to let individuals control and protect potentially
sensitive, personal information. We aim to stay up to date with any
significant updates in the aforementioned forks but want to do so upon
close inspection of any changes made. Basically: paranoia ;)

## Features

- AES-128-CBC
- HMAC-SHA256
- SHA1
- SHA256
- SHA512
- PBKDF2
- RSA

## Installation

```bash
npm install @egendata/react-native-simple-crypto

# OR

yarn add @egendata/react-native-simple-crypto
```

### Linking Automatically (for react-native <0.60)

```bash
react-native link react-native-simple-crypto
```

### Linking Manually

#### iOS

- See [Linking Libraries](http://facebook.github.io/react-native/docs/linking-libraries-ios.html)
  OR
- Drag RCTCrypto.xcodeproj to your project on Xcode.
- Click on your main project file (the one that represents the .xcodeproj) select Build Phases and drag libRCTCrypto.a from the Products folder inside the RCTCrypto.xcodeproj.

#### (Android)

- In `android/settings.gradle`

```gradle
...
include ':react-native-simple-crypto'
project(':react-native-simple-crypto').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-simple-crypto/android')
```

- In `android/app/build.gradle`

```gradle
...
dependencies {
    ...
    compile project(':react-native-simple-crypto')
}
```

- register module (in MainApplication.java)

```java
......
import com.pedrouid.crypto.RCTCryptoPackage;

......

@Override
protected List<ReactPackage> getPackages() {
   ......
   new RCTCryptoPackage(),
   ......
}
```

## API

```typescript
- AES
  - encrypt(text: ArrayBuffer, key: ArrayBuffer, iv: ArrayBuffer): Promise<ArrayBuffer>
  - decrypt(cipherText: ArrayBuffer, key: ArrayBuffer, iv: ArrayBuffer): Promise<ArrayBuffer>
- SHA
  - sha1(text: string): Promise<string>
  - sha256(text: string): Promise<string>
  - sha512(text: string): Promise<string>
- HMAC
  - hmac256(text: ArrayBuffer, key: ArrayBuffer): Promise<ArrayBuffer>
- PBKDF2
  - hash(password: string, salt: ArrayBuffer, iterations: number, keyLength: number, hash: string): Promise<ArrayBuffer>
- RSA
  - generateKeys(keySize: number): Promise<KeyPair>
  - encrypt(data: string, key: string): Promise<string>
  - sign(data: string, key: string, hash: string): Promise<string>
  - verify(secretToVerify: string, data: string, key: string, hash: string): Promise<boolean>
- utils
  - randomBytes(bytes: number): Promise<ArrayBuffer>
  - convertArrayBufferToUtf8(input: ArrayBuffer): string
  - convertUtf8ToArrayBuffer(input: string): ArrayBuffer
  - convertArrayBufferToBase64(input: ArrayBuffer): string
  - convertBase64ToArrayBuffer(input: string): ArrayBuffer
  - convertArrayBufferToHex(input: ArrayBuffer): string
  - convertHexToArrayBuffer(input: string): ArrayBuffer
```

> _NOTE:_ Supported hashing algorithms for RSA and PBKDF2 are:
>
> `"Raw" (RSA-only) | "SHA1" | "SHA224" | "SHA256" | "SHA384" | "SHA512"`

## Example

```javascript
import {
  utils,
  AES,
  HMAC,
  SHA,
  PBKDF2,
  RSA
} from "@egendata/react-native-simple-crypto";

// -- AES ------------------------------------------------------------- //

const message = "data to encrypt";
const messageArrayBuffer = utils.convertUtf8ToArrayBuffer(
  message
);

const keyArrayBuffer = await utils.randomBytes(32);
console.log("randomBytes key", keyArrayBuffer);

const ivArrayBuffer = await utils.randomBytes(16);
console.log("randomBytes iv", ivArrayBuffer);

const cipherTextArrayBuffer = await AES.encrypt(
  msgArrayBuffer,
  keyArrayBuffer,
  ivArrayBuffer
);
console.log("AES encrypt", cipherTextArrayBuffer);

const messageArrayBuffer = await AES.decrypt(
  cipherTextArrayBuffer,
  keyArrayBuffer,
  ivArrayBuffer
);
const message = utils.convertArrayBufferToUtf8(
  messageArrayBuffer
);
console.log("AES decrypt", message);

// -- HMAC ------------------------------------------------------------ //

const signatureArrayBuffer = await HMAC.hmac256(message, key);

const signatureHex = utils.convertArrayBuffertoHex(
  signatureArrayBuffer
);
console.log("HMAC signature", signatureHex);

// -- SHA ------------------------------------------------------------- //

const sha1Hash = await SHA.sha1("test");
console.log("SHA1 hash", hash);

const sha256Hash = await SHA.sha1("test");
console.log("SHA256 hash", sha256Hash);

const sha512Hash = await SHA.sha1("test");
console.log("SHA512 hash", sha512Hash);

// -- PBKDF2 ---------------------------------------------------------- //

const password = "secret password";
const salt = utils.randomBytes(8);
const iterations = 4096;
const keyInBytes = 32;
const hash = "SHA1";
const passwordKey = await Pbkdf2.hash(
  password,
  salt,
  iterations,
  keyInBytes,
  hash
);
console.log("PBKDF2 passwordKey", passwordKey);

// -- RSA ------------------------------------------------------------ //

const rsaKeys = await RSA.generateKeys(1024);
console.log("RSA1024 private key", rsaKeys.private);
console.log("RSA1024 public key", rsaKeys.public);

const rsaEncryptedMessage = await RSA.encrypt(
  message,
  rsaKeys.public
);
console.log("rsa Encrypt:", rsaEncryptedMessage);

const rsaSignature = await RSA.sign(
  rsaEncryptedMessage,
  rsaKeys.private,
  "SHA256"
);
console.log("rsa Signature:", rsaSignature);

const validSignature = await RSA.verify(
  rsaSignature,
  rsaEncryptedMessage,
  rsaKeys.public,
  "SHA256"
);
console.log("rsa signature verified:", validSignature);

const rsaDecryptedMessage = await RSA.decrypt(
  rsaEncryptedMessage,
  rsaKeys.private
);
console.log("rsa Decrypt:", rsaDecryptedMessage);
```

## Forked Libraries

- [react-native-simple-crypto](https://github.com/pedrouid/react-native-simple-crypto)
- [@trackforce/react-native-crypto](https://github.com/trackforce/react-native-crypto)
- [react-native-randombytes](https://github.com/mvayngrib/react-native-randombytes)
