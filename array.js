'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts= [account1,account2,account3,account4]

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



const displayMovements = function(movements, sort = false){
  containerMovements.innerHTML = ''

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements
  movements.forEach(function(mov, i){
    const type = mov > 0 ? 'deposit' : 'withdrawal'

  const html = `
  <div class="movements__row">
  <div class="movements__type
  movements__type--${type}">${i + 1} ${type}</div>
  <div class="movements__value">${mov}</div>
  </div>
  `;
  containerMovements.insertAdjacentHTML("afterbegin", html)
  })
}


const calcDisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov , 0)

  labelBalance.textContent = `${acc.balance} EUR`
}

const calcDisplaySummary = function(acc){
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc , mov) => acc + mov, 0)
  labelSumIn.textContent = `${incomes} Eur`

  const out =  acc.movements
  .filter(mov => mov < 0)
  .reduce((acc , mov) => acc + mov, 0)
  labelSumOut.textContent = `${Math.abs(out)} Eur`

  const interest = acc.movements
  .filter(mov => mov > 0)
  .map(mov => mov * acc.interestRate/100)
  .filter((mov, i, arr) => mov > 1)
  .reduce((acc, mov) => acc + mov, 0)
  labelSumInterest.textContent = `${interest} Eur`
}

const createUsername = function(accs){
accs.forEach(function(acc){
  acc.username = acc.owner
  .toLowerCase()
  .split(' ')
  .map( name =>  name[0])
  .join('')
});
};
createUsername(accounts);

const updateUI = function(acc){
  displayMovements(acc.movements)

  calcDisplayBalance(acc)

  calcDisplaySummary(acc)
}




let currentAccount;
//Event Handlers
btnLogin.addEventListener('click', function(e){
  //Prevent from reoading
  e.preventDefault()

 currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
 console.log(currentAccount)

 if(currentAccount?.pin === Number(inputLoginPin.value)){
  labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`

  containerApp.style.opacity = 100

  inputLoginUsername.value = inputLoginPin.value = ''
  inputLoginPin.blur()

  updateUI(currentAccount)
 }
 
  
})

btnTransfer.addEventListener('click', function(e){
  e.preventDefault()

  const amount = Number(inputTransferAmount.value)
  const receiverAcc = accounts.find(acc => acc.username  === inputTransferTo.value)

  inputTransferAmount.value = inputTransferTo.value = ''

  if(amount > 0
    &&receiverAcc
     && currentAccount.balance > amount
     && receiverAcc?.username !== currentAccount.username){
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);

      updateUI(currentAccount)
  }
})

btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const amount = Number(inputLoanAmount.value)

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    currentAccount.movements.push(amount)
    updateUI(currentAccount)
  }
  inputLoanAmount.value = ''
})

btnClose.addEventListener('click', function(e){
  e.preventDefault();

  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username)
    console.log(index)
    accounts.splice(index, 1)

    containerApp.style.opacity = 0
  }
  inputCloseUsername.value = inputClosePin.value = ''
})
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/*
//1
const bankDepositSum = accounts.map(mov => mov.movements)
.flat()
.filter(positive => positive > 0)
.reduce((acc, cur) => acc + cur, 0)
console.log(bankDepositSum)

//2 (the normal way)
//const depost1000 = accounts.flatMap(mov => mov.movements)
//.filter(mov => mov > 1000).length

//(using reduce method)
const depost1000 = accounts.flatMap(mov => mov.movements)
.reduce((count, cur) => cur >= 1000 ? ++count : count , 0 )
console.log(depost1000)

//3
const {deposits, withdrawals} = accounts.flatMap(mov => mov.movements)
.reduce(
  (sums, cur) => {
 //cur > 0 ? sums.deposits += cur : sums.withdrwals += cur; return sums
 sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur; 
 return sums;
},
 {deposits : 0, withdrawals : 0}
 );
console.log(deposits, withdrawals)

//4
const convertTitleCase = function(title){
  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const titleCase = title.toLowerCase()
  .split(' ')
  .map(word => exceptions.includes(word) ? word : capitalize(word))
  .join(' ');

  return capitalize(titleCase)
}

console.log(convertTitleCase('This is a nice title'));
console.log(convertTitleCase("I'm not yet good but I'm improving"));





/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const accountMovements = accounts
.map(acc => acc.movements)
.flat()
.reduce((acc, cur) => acc + cur, 0)
console.log(accountMovements);


const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//Why do array have methods?
//Methods are simply functions that we can call on objects (attached)
//so if we have array methods, simply means that they are also objects
//Array methods are function called on arrays
//slice method (similar to string slice): Used to extract part of an array without changing the original array

let arr = ["a", "b", "c", "d", "e", "f"]
console.log(arr.slice(2, 5))
//Splice method.Works almost the same way with slice but it changes the original array.
console.log(arr.splice(1, 3))

//Reserve 
let arr = ["a", "b", "c", "d", "e", "f"]
console.log(arr.reverse())

//Concat
let arr = ["a", "b", "c", "d", "e", "f"]
let arr2 = ['g', 'h', 'i', 'j', 'k']
let letters = arr.concat(arr2)
console.log(letters)

//Join
console.log(letters.join(','))

//The 'At' method
let arr = ["a", "b", "c", "d", "e", "f"]
console.log(arr.at(-1))

//ForEach Methods
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for(const [i, movement] of movements.entries()){
  if(movement > 0){
    console.log(`Transfer ${i + 1}: ${movement} was sent to your account`)
  }else{
    console.log(`Transfer ${i + 1}: ${Math.abs(movement)} was withdrawn from your account`)
  }
}

//Do not forget the capital E
//Requires a callback function in order to tell it what to do
//THis method is techically an higher order function
//In each iteration, it will pass in each element of the array as an arguement
console.log('-----ForEach----')
movements.forEach(function(mov, i, arr){
  if(mov > 0){
    console.log(`Transfer ${i + 1}: ${mov} was sent to your account`)
  }else{
    console.log(`Transfer ${i + 1}: ${Math.abs(mov)} was withdrawn from your account`)
  }
})
//When we use forEach / for loop
//You cannot break out in a forEach loop. continue and break doesn't work 
//If you want to break out in a loop, use the for of loop

//forEach with maps and sets
//When looping over maps with forEach, the callback function must have three parameters (the first one; values, second; key, third; map itself)
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
currencies.forEach(function(values, keys){
  console.log(`${values} : ${keys}`)
})
const checkDogs = function(dogsJulia, dogsKate){
  const dogsjuliaCorrected = dogsJulia.slice();
  dogsjuliaCorrected.splice(0,1)
  dogsjuliaCorrected.splice(-2)
  const dogs = dogsjuliaCorrected.concat(dogsKate)
  console.log(dogs)

  dogs.forEach(function(dog, i){
    if(dog >= 3){
      console.log(`("Dog number ${i + 1} is an adult, and is ${dog} years old")`)
    }else{
      console.log(`("Dog number ${i + 1} is an puppy, and is ${dog} years old")`)
    }
  })
}
checkDogs([3, 5, 2, 12, 7],[4, 1, 15, 8, 3])
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4])
//Array methods for data transformation 
//These array methods are used to create new arrays based on transforming arrays from other arrays.
//They are map, filter and reduce
//Map method is another method to loop over array(similar to forEach method)
//The difference between them is that map creates a brand new array based on the original array
//Filter mwethod is used to filter for elements in the original array with a specific condition
//reduce method can be used to calculate the elements in an array together



const dollar = 1.1
const changeToUsd = movements.map(mov => mov * dollar)

console.log(changeToUsd)

//---Using FOR-OF-LOOP---
const movEd = []
for(const move of movements){
movd.push(move * dollar) 
console.log(movEd)
}


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const string = movements.map((mov, i) => 
  `Transfer ${i + 1}: ${Math.abs(mov)} was ${mov > 0 ? 'sent to' : 
  'withdrawn from'} from your account`
)
console.log(string)

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300]
const deposits = movements.filter(function(mov){
 return mov > 0
})
const withdrawals = movements.filter(function(mov){
  return mov < 0
})
console.log(withdrawals)
console.log(deposits);

//---Reduce method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//The parameters in callback function in the reduce method
//First parameter "acc" is called accumulator.
//The accumulator keeps accumulating the value that we want to return 
//Second parameter is the current value we want to add.

const reduceMovement = movements.reduce((acc, curr ) =>{
 return  acc + curr
}, 0)
console.log(reduceMovement)

const movements1 = [200, 450, -400, 3000, -650, -130, 70, 1300];
const maximum = movements1.reduce(function(acc, cur){
  if(cur > acc){
  return cur
}else{return acc}
}, movements1[0] )
console.log(maximum)

const calcAverageHumanAge = function(ages){
  const humanAge = ages.map((age) => (age <= 2 ? 2 * age : 16 + age * 4));
  const adult = humanAge.filter((age) => age >= 18);
  console.log(humanAge);
  console.log(adult);

  const average = adult.reduce(
    (acc, age, i, arr) => acc + age , 0);
  
  return average;
}
const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
console.log(avg1);

//Method of chaining methods.
//This method makes it hard to debug 
//Chaining should not be overused because changing tons of methods can cause real performance issues when dealing with huge arrays

const calcAverageHumanAge = (ages) =>{
  const humanAge = ages.map((age) => (age <= 2 ? 2 * age : 16 + age * 4))
  .filter((age) => age >= 18)
  .reduce((acc, age, i, arr) => acc + age , 0);
  console.log(humanAge);
}
const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
console.log(avg1);

//The find Method
//Can be used to retrieve one element of an array based on a condition
//Accepts a callback function which will then be called method loops over the array
//THis method won't return a new array, it will only return the first element in the array that satisfies the condition
//filter returns all the elements that matches the condition while find returns the first one
//filter returns a new array while find returns the element itself
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const debit = movements.find(mov => mov < 0)
console.log(debit)

//The findIndex method
//Returns the index of the found element not the element itself

//some and every methods
//Receives a callback function

//SOME
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300]
console.log(movements.includes(-130))

const anyDeposits = movements.some(mov => mov > 5000);
console.log(anyDeposits)

//EVERY
//Rturns true if all of the elements in the array satisfy the condition that we pass in
console.log(movements.every(mov => mov > 0))

//Flat and flatMap method
//Imagine with have a nested array(arrays in an array), and we want to put all in one big array
const arr = [[1,2,3,4], [5,6], [7,8]]
const arrDeep = [[[1,2],3,4], [5,6], [7,8]]
console.log(arr.flat())
console.log(arrDeep.flat(2))
//flatMap is just the combination of the flat and map method

//Sort method
//Changes the original array
//STRINGS
const owners = ['Umar', 'Bori', 'Adams', 'Bolu']
console.log(owners.sort());

//NUMBERS
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300]
//ASCENDING ORDER
const order = movements.sort((a, b) => {
  if(a > b){
    return 1
  }if(a < b){
    return -1
  }
})
console.log(order);
//DESCENDING ORDER
const movements2 = [200, 450, -400, 3000, -650, -130, 70, 1300]
const order2 = movements2.sort((a, b) => {
  if(a > b){
    return -1
  }if(a < b){
    return 1
  }
})
console.log(order2);

const practice = [200, 450, -400, 3000, -650, -130, 70, 1300]
practice.sort((a, b) => a - b)
console.log(practice)

//More ways of creating and filling arrays
//1
console.log([1,2,3,4,5,6,7,8,9,0])
//2 new Array - a constructor and passing in the elements as arguments
console.log(new Array(1,2,3,5,6,7))
//3 We can also generate these arrays programatically without having to define all the items manually
//You can use the array constructor 
//Anytime you pass one argument in the new Array constructor,then it creates a new empty argument with that length
const x = new Array(7)
//We can only use the fill method on the constructor. Similar to the slice method. Wecan specify where we want to start to fill and want to end just like the slice method. so you have to add another parameter inside the method
x.fill(2, 3, 5)
console.log(x)
//We can also use it on a normal array
const y = [1,2,3,4,5,6,7,8,9,0]
y.fill(10, 5, 7)
console.log(y)
//It changes the original array

//Array from method
//It was introduced in order to create arrays from array like structures. Itcan be used to create arrays from other things
const z = Array.from({length: 7}, () => 1,7)
console.log(z)

const a = Array.from({length: 7}, (_ , i) => i + 1)
console.log(a);

const dice = Array.from({length: Math.floor(Math.random() * 100)}, (_ , i) => i + 1)

console.log(dice)
//Which array method to use
//THe first question to ask is what do i actually want this method ?
//Do i want to mutate mutate the original array or do i want a new array, do i want an array index or do i want to retrieve an entire array element or do i want to know if an array includes a certain element or maybe i just want to get a new string, to transform an array to a new value or simply loop over the array
*/
/*
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).
1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)
HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.
TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];
*/
//Last challenge
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] }
// ];

//  dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75* 28)))
// console.log(dogs)

// const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'))
// console.log(sarahDog)
// console.log(`Sarah's dog is eating  too ${ sarahDog.curFood > sarahDog.recFood ? ' much ' : ' little'}`)
// const ownersEatTooMuch = dogs.filter(dog => dog.curFood > dog.recFood)
// .flatMap(dog => dog.owners)
// console.log(ownersEatTooMuch)

// const ownersEatTooLittle = dogs.filter(dog => dog.curFood < dog.recFood)
// .flatMap(dog => dog.owners)
// console.log(ownersEatTooLittle)

// //4
// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`)
// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`)

// //5
// console.log(dogs.some(dog => dog.curFood === dog.recFood))
// //6
// const checkEating = (dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1) 
// console.log(dogs.some(checkEating))
// //7
// console.log(dogs.filter(checkEating));
// //8

// const sortFood = dogs.slice().sort((a, b) => a.recFood - b.recFood)
// console.log(sortFood)

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };
// const accounts = [account3, account4]
// account3.movements.forEach(() => {
//   console.log();
// })
// const DisplayName = function(name){
//   const display = `${name.owner} has a account here `
//   console.log(display);
// }
// DisplayName(account3)