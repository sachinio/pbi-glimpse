export interface IHost {
    on(name:string, lambda:(data:{})=>void);
    emit(name:string, data?:{}, volatile?:boolean);
}

export interface IViewport{
    height: number;
    widht: number;
}

export interface ConstructorOptions{
    host: IHost;
    element: Element;
}

export interface IGlimpse {
    resize(viewport: IViewport);
}