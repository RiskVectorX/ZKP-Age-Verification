pragma circom 2.0.0;

include "node_modules/circomlib/circuits/comparators.circom";

template AgeCheck() {
    // Private Input: The user's birth year (HIDDEN)
    signal input birthYear;

    // Public Input: The current year and the age limit (VISIBLE)
    signal input currentYear;
    signal input ageThreshold;

    // Output: 1 if Adult, 0 if Minor
    signal output isAdult;

    // Logic: Age = currentYear - birthYear
    // We want to check if Age >= ageThreshold

    signal age;
    age <== currentYear - birthYear;

    component geq = GreaterEqThan(7); // 7 bits supports numbers up to 127
    geq.in[0] <== age;
    geq.in[1] <== ageThreshold;

    isAdult <== geq.out;
}

component main = AgeCheck();