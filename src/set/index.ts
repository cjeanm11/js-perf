import data from "./data.json";

let {
    count,
    runCount,
    charsUntil,
} = data;

if (process.argv[2]) {
    count = +process.argv[2];
}

const str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+[{(&=)}]*!|`%#\\";
console.log("max", str.length);

const strFnToUse = createString;

/**
 * Creates a random string generator function.
 * @param {number} count - Number of characters to use.
 * @param {number} charsUntil - Number of characters until reset.
 * @returns {() => string} A function that generates strings.
 */
function randomCreateString(count: number, charsUntil: number): () => string {
    let substr = str.substring(0, count - 1);
    let noRepeat = str.substring(0, count);

    let i = 0;
    let innerCount = 0;
    let rand = Math.floor(Math.random() * (count - 1));

    return function() {
        i++;
        innerCount++;
        if (i < charsUntil) {
            if (innerCount === rand) {
                innerCount = 0;
                rand = Math.floor(Math.random() * (count - 1));
            }
            return substr[innerCount];
        } else {
            return noRepeat[i % count];
        }
    };
}

/**
 * Creates a string generator function.
 * @param {number} count - Number of characters to use.
 * @param {number} charsUntil - Number of characters until reset.
 * @returns {() => string} A function that generates strings.
 */
function createString(count: number, charsUntil: number): () => string {
    let substr = str.substring(0, count - 1);
    let noRepeat = str.substring(0, count);

    let i = 0;

    return function() {
        i++;
        if (i < charsUntil) {
            return substr[i % (count - 1)];
        } else {
            return noRepeat[i % count];
        }
    };
}

/**
 * Finds characters using a Set.
 * @param {() => string} iter - The string generator function.
 * @returns {number} The number of runs.
 */
function findWithSet(iter: () => string): number {
    let set = new Set<string>();
    let runs = 0;
    let resets = 0;
    let sizeOnReset = 0;

    while (set.size < count) {
        runs++;
        const char = iter();
        const len = set.size;

        set.add(char);
        if (set.size === len) {
            sizeOnReset += set.size;
            resets++;
            set = new Set<string>();
            set.add(char);
        }
    }

    return runs;
}

/**
 * Finds characters using an array.
 * @param {() => string} iter - The string generator function.
 * @returns {number} The number of runs.
 */
function findWithArray(iter: () => string): number {
    let arr: string[] = [];
    let runs = 0;
    let resets = 0;
    let sizeOnReset = 0;

    while (arr.length < count) {
        runs++;
        const char = iter();
        if (arr.includes(char)) {
            sizeOnReset += arr.length;
            arr = [];
            resets++;
        }

        arr.push(char);
    }

    return runs;
}

type Run = [number, number];

/**
 * Runs the string generator and finds characters.
 * @param {(gen: () => string) => number} fn - The function to run (Set or Array).
 * @returns {Run[]} The runtime and count.
 */
function run(fn: (gen: () => string) => number): Run[] {
    const runs: Run[] = [];

    for (let i = 0; i < runCount; ++i) {
        const gen = strFnToUse(count, charsUntil);
        const start = Date.now();
        const c = fn(gen);
        const runtime = Date.now() - start;
        runs.push([runtime, c]);
    }

    return runs;
}

/**
 * Rounds a number to three decimal places.
 * @param {number} x - The number to round.
 * @returns {number} The rounded number.
 */
function round(x: number): number {
    return Math.round(x * 1000) / 1000;
}

/**
 * Prints the statistics of the runs.
 * @param {string} name - The name of the run (Set or Array).
 * @param {Run[]} values - The values (runtime and count) from the run.
 */
function printStats(name: string, values: Run[]): void {
    const [time, count] = values.reduce(
        (acc, [time, count]) => {
            acc[0] += time;
            acc[1] += count;
            return acc;
        },
        [0, 0]
    );

    console.log(name, "total time", time, "total runs", count, "runs / time", round(count / time));
}

function runAll(): void {
    printStats("set", run(findWithSet));
    printStats("arr", run(findWithArray));
}

runAll();