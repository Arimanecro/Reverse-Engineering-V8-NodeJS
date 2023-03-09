import {setTimeout as sleep} from 'timers/promises';

var numbers = new Array(1000).fill(1);

setInterval(console.log, 100, 'timer');

// Blocking loop
for await (const num of numbers) console.log(num);
// output:
//      ALL num
//      timer
//      timer
//      timer
// etc

// Non-blocking loop
async function *generate(){
    for(let i=0; i<numbers.length;i++){
        yield i;
        let res = await sleep(100, 'sleep');
        console.log(res)
    }
}
for await(let chunk of generate()) console.log(chunk);
// output:
//      chunk
//      timer
//      sleep
//      chunk
//      timer
//      sleep
// etc