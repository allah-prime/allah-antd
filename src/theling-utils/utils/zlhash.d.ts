import { sha256Hex } from './WebCrypto';
declare const zlhash: {
    getUuid: () => string;
    test: (x: string) => string;
    sha256Hex: typeof sha256Hex;
};
export { sha256Hex };
export default zlhash;
