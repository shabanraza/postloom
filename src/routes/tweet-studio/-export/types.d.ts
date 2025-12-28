declare module 'gif.js' {
    interface GIFOptions {
        workers?: number
        quality?: number
        width?: number
        height?: number
        repeat?: number
        workerScript?: string
        background?: string
        transparent?: string | null
    }

    interface FrameOptions {
        delay?: number
        copy?: boolean
        dispose?: number
    }

    class GIF {
        constructor(options?: GIFOptions)
        addFrame(canvas: HTMLCanvasElement, options?: FrameOptions): void
        on(event: 'start', callback: () => void): void
        on(event: 'progress', callback: (progress: number) => void): void
        on(event: 'finished', callback: (blob: Blob) => void): void
        on(event: 'error', callback: (error: Error) => void): void
        render(): void
        abort(): void
    }

    export default GIF
}

declare module 'html2canvas' {
    interface Options {
        scale?: number
        useCORS?: boolean
        allowTaint?: boolean
        backgroundColor?: string | null
        logging?: boolean
        width?: number
        height?: number
        x?: number
        y?: number
    }

    function html2canvas(element: HTMLElement, options?: Options): Promise<HTMLCanvasElement>
    export default html2canvas
}
