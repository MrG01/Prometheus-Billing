'use strict';

var submitButton = document.getElementById('submit');

  submitButton.addEventListener(
      'click', function(event){
          event.preventDefault();
          //alert('you clicked this submit again.');

          if(validateName() && validateSurname() && validateAge() &&
            validateGender() && validateAddress() && validatePhone()){
              console.log('Works');
          }else {
              console.log("fails");
          }

          validateName();
          validateSurname();
          validateAge();
          validateGender();
          validateAddress();
          validatePhone();
      });

/**
 * This functionvalidates the name from the name input
 */
function validateName(){
    var name = document.getElementById('name');
    var p = document.getElementById('error-name');

    if(name.value === "" || name.value === undefined){
        p.classList.remove('is-invisible');

        return false;
    } else {
        p.classList.add('is-invisible');
    }

    return true;
}

/**
 * This function validates the surname from the surname input
 */
function validateSurname(){
    var surname = document.getElementById('surname');
    var p = document.getElementById('error-surname');

    if(surname.value === "" || surname.value === undefined){
        p.classList.remove('is-invisible');

        return false;
    } else {
        p.classList.add('is-invisible');
    }

    return true;
}

/**
 * This function validates the age from the age input  18-38, 42-64
 */
function validateAge(){
    var age = document.getElementById('age');
    var p = document.getElementById('error-age');

    if(
        age.value === "" || age.value === undefined ||
        ( !(age.value >= 18 && age.value <= 38) && !(age.value >= 42 && age.value <= 64) )
    ) {
        if(age.value < 18){
            p.innerHTML = "Too Young.";
        } else if (age.value > 64) {
            p.innerHTML = "Too old.";
        } else {
            p.innerHTML = "Invalid age.";
        }

        p.classList.remove('is-invisible');

        return false;
    } else {
        p.classList.add('is-invisible');
    }

    return true;
}

function validateGender(){
    var gender = document.getElementById('gender');
    var p = document.getElementById('error-gender');

    if(gender.value === "" || gender.value === undefined){
        p.classList.remove('is-invisible');

        return false;
    } else {
        p.classList.add('is-invisible');
    }

    return true;
}

function validateAddress(){
    var address = document.getElementById('address');
    var p = document.getElementById('error-address');

    if(address.value === "" || address.value === undefined){
        p.classList.remove('is-invisible');

        return false;
    } else {
        p.classList.add('is-invisible');
    }

    return true;
}

/**
 *
 */
function validatePhone(){
    var phone = document.getElementById('phone');
    var p = document.getElementById('error-phone');

    if(phone.value === "" || phone.value === undefined || phone.value.length !== 10){
        p.classList.remove('is-invisible');

        return false;
    } else {
        p.classList.add('is-invisible');
    }

    return true;
}