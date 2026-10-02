/**
 * 对称加解密工具
 *
 * 默认使用浏览器原生 Web Crypto API（AES-GCM），
 * 传第二个参数 useCryptoJS=true 则使用 crypto-js（兼容旧数据）。
 *
 * 密文自动带前缀标识，解密时自动识别：
 *   "W:..." → WebCrypto 加密
 *   "C:..." → crypto-js 加密
 *   无前缀 → 尝试 crypto-js（兼容旧数据）
 *
 * @example
 *   const cipher = await WebCrypto.encrypt("hello", "my-key");
 *   const plain  = await WebCrypto.decrypt(cipher, "my-key");
 *
 *   // 使用 crypto-js 模式（兼容旧系统）
 *   const oldCipher = await WebCrypto.encrypt("hello", "my-key", true);
 */
/**
 * 加密
 * @param plainText 明文
 * @param secret 密钥
 * @param useCryptoJS 传 true 使用 crypto-js（兼容旧数据），默认 false 使用 Web Crypto API
 * @returns 密文字符串（带前缀标识加密方式）
 */
export declare function encrypt(plainText: string, secret: string, useCryptoJS?: boolean): Promise<string>;
/**
 * 解密（自动识别密文类型）
 * @param cipherText 密文
 * @param secret 密钥
 * @returns 明文
 */
export declare function decrypt(cipherText: string, secret: string): Promise<string>;
/**
 * 检查 Web Crypto API 是否可用。
 * 非安全上下文（如内网 http://192.168.x.x）下 `crypto.subtle` 为 undefined。
 */
export declare function isSupported(): boolean;
/**
 * 计算 SHA-256（小写 hex）。
 * 安全上下文优先用浏览器 `crypto.subtle`；内网 HTTP 等环境回退 crypto-js。
 */
export declare function sha256Hex(data: ArrayBuffer | ArrayBufferView | Blob | string): Promise<string>;
declare const WebCrypto: {
    encrypt: typeof encrypt;
    decrypt: typeof decrypt;
    isSupported: typeof isSupported;
    sha256Hex: typeof sha256Hex;
};
export default WebCrypto;
