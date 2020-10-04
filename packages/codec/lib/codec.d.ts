export interface Codec<B> {
    encode<T>(item: T): B;
    decode<T>(value: B): T;
}
export declare class JsonCodec implements Codec<string> {
    private static readonly Undefined;
    encode<T>(item: T): string;
    decode<T>(value: string): T;
}
