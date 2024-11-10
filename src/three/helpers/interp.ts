export enum SmoothType {
    FLAT,
    EASYALL,
    EASYOUT
}

export class Interp {
    time: number = 0;

    constructor(private duration: number, private smoothType: SmoothType) {}

    done(): boolean {
        return this.percent() >= 1;
    }

    increment(deltaTime: number): number {
        if (this.done()) return 1;
        
        this.time += deltaTime;

        return this.smoothPercent(this.percent());
    }

    percent(): number {
        return this.time / this.duration;
    }

    private smoothPercent(t: number): number {
        switch (this.smoothType) {
            case SmoothType.FLAT:
                return t;
            case SmoothType.EASYALL:
                return t * t * (3 - (2 * t));
            case SmoothType.EASYOUT:
                return this.flip(this.square(this.flip(t)));
        }
    }

    private flip(t: number): number {
        return 1 - t;
    }

    private square(t: number): number {
        return t * t;
    }
}
