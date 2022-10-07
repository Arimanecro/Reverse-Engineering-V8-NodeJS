// Worst ways (const and let)
{
    let a = 1;
    let b = 2;
    const test = () => a + b;
    test(2);
}
// Bytecode length: 13
// LdaImmutableCurrentContextSlot [2]
// ThrowReferenceErrorIfHole [0] <-- ADDITIONAL VERIFICATION
// Star0
// LdaImmutableCurrentContextSlot [3]
// ThrowReferenceErrorIfHole [1] <-- ADDITIONAL VERIFICATION
// Add r0, [0]
// Return
{
    const a = 1;
    const test = (b) => a + b;
    test(2);
}
// Bytecode length: 11 
// LdaImmutableCurrentContextSlot [2]
// ThrowReferenceErrorIfHole [0] <-- ADDITIONAL VERIFICATION
// Star0
// Ldar a0
// Add r0, [0]
// Return

// Better way (var)
{
    var a = 1;
    const test = (b) => a + b;
    test(2);
}
// Bytecode length: 9
// LdaImmutableCurrentContextSlot [2]
//                              <-- NO ADDITIONAL VERIFICATION
// Star0
// Ldar a0
// Add r0, [0]
// Return

// Best way!! (as arguments)
{
    var a = 1;
    var b = 2;
    const test = (a, b) => a + b;
    test(a, b);
}
{
    let a = 1;
    let b = 2;
    const test = (a, b) => a + b;
    test(a, b);
}
// Bytecode length: 6
// Ldar a0
// Add r0, [0]
// Return


// node --print-bytecode --print-bytecode-filter=test var-vs-let"&"const.js