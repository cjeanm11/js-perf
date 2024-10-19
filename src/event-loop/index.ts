// tick function, resolves immediately and returns a Promise<void>
function tick(): Promise<void> {
    return new Promise<void>(res => res());
}

// print function, returns a function that logs a message
function print(hello: string): () => void {
    return function() {
        console.log(hello);
    };
}

// addToNextTick function, schedules a callback in a microtask (using Promise)
function addToNextTick(cb: () => void): () => void {
    return function() {
        return new Promise<void>(res => {
            res();
        }).then(cb);
    }
}

// promiseTiming function, logs a message immediately and returns a resolved promise
function promiseTiming(): Promise<void> {
    return new Promise<void>(res => {
        console.log("promise constructor");
        res();
    });
}

const h1 = addToNextTick(print("hello"));

async function main(): Promise<void> {
    // Loops 10 times and schedules "hello" to be printed in a microtask each time
    for (let i = 0; i < 10; i++) {
        h1();
    }

    // Logs "promise constructor" and resolves the promise
    promiseTiming();

    console.log("Start");

    // Schedules "Microtask" to be printed as a microtask
    Promise.resolve().then(() => console.log("Microtask"));

    // Schedules "Macrotask" to be printed as a macrotask
    setTimeout(() => console.log("Macrotask"), 0);

    console.log("End");

    // Expected output:
    // Start
    // End
    // promise constructor
    // Microtask
    // hello (x10)
    // Macrotask
}

main();