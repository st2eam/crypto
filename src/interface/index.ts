/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ISingleton {
    value: any;
    setValue: (value: any) => void,
    source: any,
    setSource: (value: any) => void,
    encrypt: (value: any, secret_key: string) => string,
    decrypt: (value: any, secret_key: string) => string,
}

export interface ISecret {
    setValue: (value: string) => void,
    getValue: () => string,
}
