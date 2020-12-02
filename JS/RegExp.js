// REGULAR EXPRESSION
var sText = "Serhat mercan serhat Mercan SERHAT MERCAN 1234567890";

// Case Insensitive Matching => i
sText.match(/MERCAN/i); // => ["mercan", index: 7, input: "Serhat mercan serhat Mercan SERHAT MERCAN", groups: undefined]

// Any Characters Match => []
sText.match(/[h]/g); // => ["h", "h"]

// Any Digit Match => []
sText.match(/[0-5]/g); // => ["1", "2", "3", "4", "5", "0"]

// Alternatives => | 
sText.match(/(serhat|Serhat)/g); // => ["Serhat", "serhat"]

// Digit Match => \ 
sText.match(/\d/g); // => ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]

// Whitespace Character Match => \s
sText.match(/\s/g); // => [" ", " ", " ", " ", " ", " "] 

// Word Match => \b
sText.match(/\bSE/); // => ["SE", index: 28, input: "Serhat mercan serhat Mercan SERHAT MERCAN 1234567890", groups: undefined]

// Contains Word => .+
sText.match(/an+/g); // => ["an", "an"]

// Contains Word Zero or More => .*	
sText.match(/an*/g); // => ["a", "an", "a", "an"]

// Contains Word Zero or One => .?
sText.match(/10?/g); // => ["1"]