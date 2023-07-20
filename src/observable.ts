class ObserverWrapper
{
    public active: boolean;

    constructor(public readonly callback: () => void)
    {
        this.active = true;
    }
}


export class Observable<T>
{
    private _value: T;

    private observers: ObserverWrapper[];

    constructor(initialValue: T)
    {
        this._value = initialValue;
        this.observers = [];
    }

    public observe(observer: () => void): () => void
    {
        const wrapper = new ObserverWrapper(observer);
        this.observers.push(wrapper);

        return () => wrapper.active = false;
    }

    public get value(): T
    {
        return this._value;
    }

    public set value(newValue: T)
    {
        this._value = newValue;
        this.notifyObservers();
    }

    private notifyObservers(): void
    {
        const newObserverList = [];

        for ( const observer of this.observers.slice() )
        {
            if ( observer.active )
            {
                newObserverList.push(observer);
                observer.callback();
            }
        }

        this.observers = newObserverList;
    }
}
