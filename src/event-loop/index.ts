// ex - 1

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

// Schedule "hello" to be printed in a microtask
const h1 = addToNextTick(print("hello"));




// Example 1
async function ex1(): Promise<void> {
    console.log();
    console.log("ex 1");
    console.log();

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

// Simulated API call to fetch data
async function getDataFromAPI(): Promise<any> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                message: "Data fetched successfully!",
                timestamp: new Date().toISOString(),
            });
        }, 1000); // Simulate network delay
    });
}

function updateUI(data: any): void {
    console.log("Message:", data.message); 
    console.log("Fetched at:", data.timestamp); 
}

async function fetchData() {
    await tick(); // Ensures UI is updated before data fetch
    const data = await getDataFromAPI();
    updateUI(data); 
}

// Example 2
async function ex2(): Promise<void> {
    console.log();
    console.log("ex 2");
    console.log();

    console.log("Fetching data...");
    fetchData().then(() => console.log("Data fetched."));
}


// Execute both examples
async function main(): Promise<void> {
    await ex1();
    await ex2();
    await ex3();
}

main();

function monitorPerformance<T extends (...args: any[]) => Promise<any>>(fn: T): T {
    return async function(...args: Parameters<T>): Promise<ReturnType<T>> {
        await tick();
        const start = performance.now(); 
        const result = await fn(...args);
        const end = performance.now();
        console.log(`Execution time for ${fn.name}: ${end - start}ms`); // Log execution time
        return result;
    } as T;
}


async function fetchDataJson(): Promise<any> {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    return await response.json(); 
}

async function ex3(): Promise<void> {
    const monitoredFetchData = monitorPerformance(fetchDataJson);
    console.log();
    console.log("ex 3");
    console.log();
    console.log("Fetching data...");
    const data = await monitoredFetchData(); // Call the monitored function
}
