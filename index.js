"use strict";

import base64js from "base64-js";
import hexLite from "hex-lite";
import { NativeModules } from "react-native";

function convertArrayBufferToUtf8(arrayBuffer) {
  const array = new Uint8Array(arrayBuffer);
  const chars = [];
  let i = 0;

  while (i < array.length) {
    const byte = array[i];
    if (byte < 128) {
      chars.push(String.fromCharCode(byte));
      i++;
    } else if (byte > 191 && byte < 224) {
      chars.push(
        String.fromCharCode(((byte & 0x1f) << 6) | (array[i + 1] & 0x3f))
      );
      i += 2;
    } else {
      chars.push(
        String.fromCharCode(
          ((byte & 0x0f) << 12) |
            ((array[i + 1] & 0x3f) << 6) |
            (array[i + 2] & 0x3f)
        )
      );
      i += 3;
    }
  }

  const utf8 = chars.join("");
  return utf8;
}

function convertUtf8ToArrayBuffer(utf8) {
  const bytes = [];

  let i = 0;
  utf8 = encodeURI(utf8);
  while (i < utf8.length) {
    const byte = utf8.charCodeAt(i++);
    if (byte === 37) {
      bytes.push(parseInt(utf8.substr(i, 2), 16));
      i += 2;
    } else {
      bytes.push(byte);
    }
  }

  const array = new Uint8Array(bytes);
  const arrayBuffer = array.buffer;
  return arrayBuffer;
}

function convertArrayBufferToBase64(arrayBuffer) {
  const byteArray = new Uint8Array(arrayBuffer);
  const result = base64js.fromByteArray(byteArray);
  return result;
}

function convertBase64ToArrayBuffer(base64) {
  const result = base64js.toByteArray(base64).buffer;
  return result;
}

function convertArrayBufferToHex(arrayBuffer) {
  const result = hexLite.fromBuffer(arrayBuffer);
  return result;
}

function convertHexToArrayBuffer(hex) {
  const result = hexLite.toBuffer(hex);
  return result;
}

function randomBytes(length) {
  return new Promise((resolve, reject) => {
    NativeModules.RNRandomBytes.randomBytes(length, function(err, base64) {
      if (err) {
        reject(err);
      } else {
        const result = convertBase64ToArrayBuffer(base64);
        resolve(result);
      }
    });
  });
}

export const AES = {
  encrypt: function(textArrayBuffer, keyArrayBuffer, ivArrayBuffer) {
    const textString = convertArrayBufferToUtf8(textArrayBuffer);
    const keyHex = convertArrayBufferToHex(keyArrayBuffer);
    const ivHex = convertArrayBufferToHex(ivArrayBuffer);
    return new Promise((resolve, reject) => {
      NativeModules.Aes.encrypt(textString, keyHex, ivHex)
        .then(cipherTextBase64 => {
          const result = convertBase64ToArrayBuffer(cipherTextBase64);
          resolve(result);
        })
        .catch(error => reject(error));
    });
  },
  decrypt: function(cipherTextArrayBuffer, keyArrayBuffer, ivArrayBuffer) {
    const cipherTextBase64 = convertArrayBufferToBase64(cipherTextArrayBuffer);
    const keyHex = convertArrayBufferToHex(keyArrayBuffer);
    const ivHex = convertArrayBufferToHex(ivArrayBuffer);
    return new Promise((resolve, reject) => {
      NativeModules.Aes.decrypt(cipherTextBase64, keyHex, ivHex)
        .then(textString => {
          const result = convertUtf8ToArrayBuffer(textString);
          resolve(result);
        })
        .catch(error => reject(error));
    });
  }
};

export const SHA = NativeModules.Sha;

export const HMAC = {
  hmac256: function(textArrayBuffer, keyArrayBuffer) {
    const textHex = convertArrayBufferToHex(textArrayBuffer);
    const keyHex = convertArrayBufferToHex(keyArrayBuffer);
    return new Promise((resolve, reject) => {
      NativeModules.Hmac.hmac256(textHex, keyHex)
        .then(signatureHex => {
          const result = convertHexToArrayBuffer(signatureHex);
          resolve(result);
        })
        .catch(error => reject(error));
    });
  }
};

export const PBKDF2 = {
  hash: function(password, saltArrayBuffer, iterations, keyLength, hash) {
    const saltBase64 = convertArrayBufferToBase64(saltArrayBuffer);
    return new Promise((resolve, reject) => {
      NativeModules.Pbkdf2.hash(
        password,
        saltBase64,
        iterations,
        keyLength,
        hash
      )
        .then(hashHex => {
          const result = convertHexToArrayBuffer(hashHex);
          resolve(result);
        })
        .catch(error => reject(error));
    });
  }
};

export const RSA = NativeModules.Rsa;

export const utils = {
  randomBytes: randomBytes,
  convertArrayBufferToUtf8: convertArrayBufferToUtf8,
  convertUtf8ToArrayBuffer: convertUtf8ToArrayBuffer,
  convertArrayBufferToBase64: convertArrayBufferToBase64,
  convertBase64ToArrayBuffer: convertBase64ToArrayBuffer,
  convertArrayBufferToHex: convertArrayBufferToHex,
  convertHexToArrayBuffer: convertHexToArrayBuffer
};
