export const isValidField = (value, regex) => {
  console.log('value',value,regex)
    if (value == undefined || !value) {
      return false;
    }
    let data = value;
    if (!regex) {
      return true;
    } else {
      let re = new RegExp(regex);
      return re.test(data);
    }
  };


  export const isValidSIN = (sin) => {
    console.log('sin 123456782', sin);
    const isEmpty = typeof sin === 'undefined' || sin === null || sin.length == 0 || sin.length < 8;
    if (isEmpty) return false
    const isZero = parseInt(sin) == 0;
    if (isZero) return false
    const eightDigits = sin.substring(0, 8); //Grabs 8 first 8 digits
    const checkDigit = sin.substring(8); //Grabs the 9th digit
    console.log('The first eight digits are: ' + eightDigits);
    console.log('The Check-digit is: ' + checkDigit);
  
    let total;
    let total2 = 0;
    let counter = 0;
  
    /*
     * These following codes are basically assigning the values by parsing
     * the substrings into an integer values by the assigned indexes and
     * multiplying by the specific index positions
     * e.g even positions - 2,4,6,8
     */
    let first = parseInt(eightDigits.substring(0, 1));
    //System.out.println(first);
  
    let second = parseInt(eightDigits.substring(1, 2)) * 2;
    //System.out.println(second);
  
    let third = parseInt(eightDigits.substring(2, 3));
    //System.out.println(third);
  
    let fourth = parseInt(eightDigits.substring(3, 4)) * 2;
    //System.out.println(fourth);
  
    let fifth = parseInt(eightDigits.substring(4, 5));
    //System.out.println(fifth);
  
    let sixth = parseInt(eightDigits.substring(5, 6)) * 2;
    //System.out.println(sixth);
  
    let seventh = parseInt(eightDigits.substring(6, 7));
    //System.out.println(seventh);
  
    let eighth = parseInt(eightDigits.substring(7, 8)) * 2;
    //System.out.println(eighth);
    console.log('========.',first, second, third, fourth, fifth, sixth, seventh,eighth)
  
    /*
     * The if statements are determining if the variables are greater
     * than 9, if so, double digits will be seperated
     */
    if (second > 9) {
      let firstHalf = parseInt(second / 10);
      let secondHalf = second % 10;
      let sum = firstHalf + secondHalf;
      second = sum;
      //System.out.println("Total " + sum);
    }
  
    if (fourth > 9) {
      let firstHalf1 = parseInt(fourth / 10)
      let secondHalf1 = fourth % 10;
      let sum1 = firstHalf1 + secondHalf1;
      fourth = sum1;
      //System.out.println("Total 1 " + sum1);
    }
  
    if (sixth > 9) {
      let firstHalf2 = parseInt(sixth / 10)
      let secondHalf2 = sixth % 10;
      let sum2 = firstHalf2 + secondHalf2;
      sixth = sum2;
      //System.out.println("Total 2 " + sum2);
    }
  
    if (eighth > 9) {
      let firstHalf3 = parseInt(eighth / 10)
      let secondHalf3 = eighth % 10;
      let sum3 = firstHalf3 + secondHalf3;
      eighth = sum3;
      //System.out.println("Total 3 " + sum3);
    }
  
    console.log('========.1111',first, second, third, fourth, fifth, sixth, seventh,eighth)
    //Adding all the finalized variables together
    total = first + second + third + fourth + fifth + sixth + seventh + eighth;
    console.log('This is the total so far: ' + total);
    total2 = total;
  
    /*The loop will subtract 10 and then multiply the total by 10 to
          determine the next highest value and pass the answer into variable
          result
           */
    while (total > 0) {
      counter++;
      total = total - 10;
    }
    let result = counter * 10;
  
    console.log('This is the next highest number divisble by 10: ' + result);
    let remaining = result - total2;
  
    // if the checksum is divisible by 10 then it's valid
    console.log('remaining == parseInt(checkDigit)',remaining == parseInt(checkDigit))
    return remaining == parseInt(checkDigit);
  };