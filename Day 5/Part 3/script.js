window.onload = function() {
  var submitButton = document.getElementById('submit');

  submitButton.addEventListener(
      'click', function(event){
          event.preventDefault();
          //alert('you clicked this submit again.');

          let name = getName();
          let surname = getSurname();
          let age = getAge();
          let phoneNumber = getPhoneNumber();

          if(age < 18){
              alert("You are not old enough to use this form.");
          } else if(name === "" || name === undefined) {
              alert("Please enter your name");
          } else if(surname === "" || surname === undefined){
              alert("Please enter your surname");
          } else if(phoneNumber === "" || phoneNumber === undefined || phoneNumber.length !== 10) {
              alert("Please enter your phone number");
          }



          else {
              alert("Hello " + name + " " + surname + ". You are " + age + "years old.")
          }
      });
};

/**
 * This function gets the name from the name input
 */
function getName(){
    let name = document.getElementById('name');

    return name.value
}

/**
 * This function gets the surname from the surname input
 */
function getSurname(){
    let surname = document.getElementById('surname');

    return surname.value
}

/**
 * This function gets the age from the age input
 */
function getAge(){
    let age = document.getElementById('age');

    return age.value
}

/**
 *
 */
function getPhoneNumber(){
    let phoneNumber = document.getElementById('phoneNumber');

    return phoneNumber.value;
}