
const bits = {
    /** @returns bitsArray | (1 << (position - 1)) */
    add(bitsArray: number, position: number): number {
        return bitsArray | (1 << (position - 1));
    },
    /** @returns bitsArray & ~(1 << (position - 1)) */
    remove(bitsArray: number, position: number): number {
        return bitsArray & ~(1 << (position - 1));
    },
    /** @returns (bits.add) == bitsArray */
    has(bitsArray: number, position: number): boolean {
        return (bitsArray | (1 << (position - 1))) == bitsArray;
    },

    reverse(bitsArray: number, length: number) {
        if (length > 32) {
            throw Error("Bit manipulation is limited to <= 32 bit numbers in JavaScript.");
        }
        let result = 0;
        for (let i = 0; i < length; i++) {
            result = result << 1;
            result = result | (bitsArray & 0b1);
            bitsArray = bitsArray >> 1;
        }
        return result >>> 0;
    }
}

const bufferBits = {
    has(buf256: number[], position: number) {
        position -= 1;
        return bits.has(
            // buf256[position / 8]
            buf256[position >> 3],
            (position % 8) + 1
        );
    },
    remove(buf256: number[], position: number) {
        position -= 1;
        let i = position >> 3;
        buf256[i] = bits.remove(buf256[i], (position % 8) + 1);
        return buf256;
    },
    add(buf256: number[], position: number) {
        position -= 1;
        let i = position >> 3;
        buf256[i] = bits.add(buf256[i], (position % 8) + 1);
        return buf256;
    },
}

function testBits() {
    let arr = Array<number>(4).fill(0);
    let str = '', str2 = '';
    let error = false;
    for (let i = 0; i < 4*8;i++) {
        str = '0'.repeat(32);
        str = str.substring(0, 31-i) + '1' + str.substring(32-i);
        bufferBits.add(arr, i+1);
        str2 = arr.map(a => a.toString(2).padStart(8, '0')).reverse().join('');
        if (!bufferBits.has(arr, i+1)) {
            error = true;
            console.error("MISS:", str2, "dont has 1 with index", i+1, '????');
        }
        if (str != str2) {
            error = true;
            console.error("MISS:", str2, 'but except', str);
        }
        bufferBits.remove(arr, i+1);
        if (arr.find(Boolean)) {
            error = true;
            console.error('Find num after remove', str2)
        }
    }
    if (error) throw new Error("Failed buffer bits");
    // console.log('sus', bufferBits.has([1], 1));
}
testBits();

export { 
    bits,
    bufferBits
}