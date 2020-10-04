declare type UnknownOrPromiseUnknown = unknown | Promise<unknown>;
export interface EventListenable<E> {
    on: <K extends keyof E>(name: K, handler: (event: E[K]) => UnknownOrPromiseUnknown) => this;
}
export declare class EventBroker<E> implements EventListenable<E> {
    private readonly handlers;
    on: <K extends keyof E>(name: K, handler: (event: E[K]) => UnknownOrPromiseUnknown) => this;
    protected fire: <K extends keyof E>(name: K, event: E[K]) => Promise<boolean>;
}
export {};
