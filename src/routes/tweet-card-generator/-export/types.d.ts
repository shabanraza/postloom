declare module 'gifenc' {
    interface QuantizeOptions {
        format?: 'rgb565' | 'rgb444' | 'rgba4444'
        oneBitAlpha?: boolean | number
        clearAlpha?: boolean
        clearAlphaThreshold?: number
        clearAlphaColor?: number
    }

    interface WriteFrameOptions {
        palette?: number[][]
        first?: boolean
        transparent?: boolean
        transparentIndex?: number
        delay?: number
        repeat?: number
        dispose?: number
    }

    interface GIFEncoderOptions {
        auto?: boolean
    }

    interface GIFEncoder {
        writeFrame(index: Uint8Array, width: number, height: number, opts?: WriteFrameOptions): void
        finish(): void
        bytes(): Uint8Array
    }

    export function quantize(
        rgba: Uint8Array | Uint8ClampedArray,
        maxColors: number,
        options?: QuantizeOptions
    ): number[][]

    export function applyPalette(
        rgba: Uint8Array | Uint8ClampedArray,
        palette: number[][],
        format?: 'rgb565' | 'rgb444' | 'rgba4444'
    ): Uint8Array

    export function GIFEncoder(options?: GIFEncoderOptions): GIFEncoder
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
