// Set Time Out w/ Timer
setTimeout(() => alert("Hello"), 1000);

// Set Time Out w/out Timer
setTimeout(() => alert("Hello"));

// Set & Reset Time Out 
let tTimeout = setTimeout(() => alert("Hello"), 1000);
clearTimeout(tTimeout);

// Set & Reset Time Out w/ Interval
let tInterval = setInterval(() => alert("Hello"), 1000);
clearTimeout(tInterval);