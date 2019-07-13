declare type AnyOrPromiseAny = any | Promise<any>;
export interface IEventListenable<E> {
    on: <K extends keyof E>(name: K, handler: (event: E[K]) => AnyOrPromiseAny) => this;
}
export declare class EventBroker<E> implements IEventListenable<E> {
    private readonly handlers;
    on: <K extends keyof E>(name: K, handler: (event: E[K]) => any) => this;
    protected fire: <K extends keyof E>(name: K, event: E[K]) => Promise<boolean>;
}
export {};
