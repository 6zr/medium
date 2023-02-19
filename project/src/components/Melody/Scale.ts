const pitchClassList = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export class Scale {
    constructor(
        public readonly pitchClass: string,
        public readonly octave: number,
    ) {}

    get scaleText() {
        return `${this.pitchClass}${this.octave}`;
    }

    get pitchClassLevel() {
        return pitchClassList.indexOf(this.pitchClass);
    }

    shift(octave: number = 0, sharp: boolean = false): Scale {
        let pitchClass = this.pitchClass;
        let carryOver = 0;

        if (sharp && this.pitchClassLevel >= (pitchClassList.length - 1)) {
            pitchClass = pitchClassList[0];
            carryOver = 1;
        } else if (sharp) {
            pitchClass = pitchClassList[this.pitchClassLevel + 1];
        }
        return new Scale(pitchClass, this.octave + octave + carryOver);
    }
}
