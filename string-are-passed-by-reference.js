// Primitive value like string and number are always passed by reference just as object/array!
// Proof:

const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;

const memory = () => {
    const memoryData = process.memoryUsage();
    return {
        heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> the total size of the allocated heap`,
        heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
    }    
}

console.log(memory()); // ~5MB
let string = "aaaaaaaaaaa".repeat(1_000_000) // ~11 MB
console.log(memory()); // ~ 15MB (5+11)

let string2;
let arr = [];
let func = (letter) => { let a = letter + letter; };

string2 = string; 

console.log(memory()); // expectation: ~26MB (15+11), reality: ~15.8 MB

arr.push(string); // expectation: ~37MB, reality: ~15.8 MB
arr.push(string); // expectation: ~48MB, reality: ~15.8 MB
arr.push(string); // expectation: ~59MB, reality: ~15.8 MB
arr.push(string); // expectation: ~70MB, reality: ~15.8 MB
arr.push(string); // expectation: ~81MB, reality: ~15.8 MB

console.log(memory()); // ~15.8 MB

func(string);

console.log(memory()); // expectation: ~103MB, reality: ~15.80 MB

// The same memory address!
string // 0x02e684e4cb69
string2 // 0x02e684e4cb69
arr // 0-4: 0x02e684e4cb69 <String[4]: #aaaaaaaaaaa>