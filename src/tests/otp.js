const numbers = [0,1,2,3,4,5,6,7,8,9]

let i = 0;
otp = "";
while (i < 6) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    otp += numbers[randomIndex];
    numbers.splice(randomIndex, 1);
    i++;
}

console.log(otp);