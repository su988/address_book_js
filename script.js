// Get the modal
let modal = document.getElementById('myModal');

// Get the button that opens the modal
let open_modal_btn = document.getElementById('modal_open');

// Get the <span> element that closes the modal
let span_close_modal = document.getElementsByClassName('modal_close')[0];

// contact form input values
let inputs = document.querySelectorAll('.input_container[data-error] .input');

// indiviudal input values
let first_name = document.querySelector('#fname');
let last_name = document.querySelector('#lname');
let telephone = document.querySelector('#number');
let address = document.querySelector('#address');
let form_btn = document.querySelector('#modal_form_btn');

let contact_list_el = document.querySelector('.contact_list');

// list of contacts (array of objects [{}, {}, [}]])
let contactList = [];

// initial request to fetch contacts from local storage
myLoad = () => {
  let list = JSON.parse(localStorage.getItem('contacts')) || [];
  renderContacts(list);
};

//_________OPEN CLOSE MODAL_________//

// When the user clicks on the add newbutton, open the modal
open_modal_btn.onclick = () => {
  modal.style.display = 'block';
  first_name.value = '';
  last_name.value = '';
  number.value = '';
  address.value = '';
};

// When the user clicks on <span> (x), close the modal
span_close_modal.onclick = () => {
  modal.style.display = 'none';
  inputs.forEach((inpEl) => {
    inpEl.parentElement.classList.remove('input_parent');
  });
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
    inputs.forEach((inpEl) => {
      inpEl.parentElement.classList.remove('input_parent');
    });
  }
};

//___________________________//

//________ADD CONTACT________//

//___________________________//

// adding contact to the list / localstorage
form_btn.addEventListener('click', function (e) {
  if (validate_inputs()) {
    let person = createContact();
    let storage_history = JSON.parse(localStorage.getItem('contacts')) || [];
    storage_history.push(person);

    addToLocalStorage(storage_history);
    modal.style.display = 'none';
  } else {
    console.log('rejected');
  }
});

// event listener to remove error message class on input
inputs.forEach((inputEl) => {
  inputEl.addEventListener('input', () =>
    inputEl.parentElement.classList.remove('input_parent')
  );
});

// validate inputs enterd by user. cannot be empty
validate_inputs = () => {
  let submit = true;

  if (!validateTelephone(telephone.value)) {
    inputs[2].parentElement.classList.add('input_parent');
    submit = false;
  }
  if (last_name.value === '') {
    inputs[1].parentElement.classList.add('input_parent');
    submit = false;
  }
  if (first_name.value === '') {
    inputs[0].parentElement.classList.add('input_parent');
    submit = false;
  }
  if (address.value === '') {
    inputs[3].parentElement.classList.add('input_parent');
    submit = false;
  }
  return submit;
};

// create contact object
createContact = () => {
  let newContact = {};

  newContact['first_name'] =
    first_name.value.charAt(0).toUpperCase() +
    first_name.value.slice(1).toLowerCase().trim();

  newContact['last_name'] =
    last_name.value.charAt(0).toUpperCase() +
    last_name.value.slice(1).toLowerCase().trim();

  newContact['address'] = address.value;

  newContact['telephone'] = formatPhoneNumber(telephone.value);

  return newContact;
};

// function to add contacts to local storage
addToLocalStorage = (contacts) => {
  // conver the array to string then store it.
  localStorage.setItem('contacts', JSON.stringify(contacts));
  // render them to screen
  renderContacts(contacts);
};

// validate phone number
validateTelephone = (number) => {
  let patt = new RegExp(
    /^\+?1?\s*?\(?\d{3}(?:\)|[-|\s])?\s*?\d{3}[-|\s]?\d{4}$/
  );
  if (number.match(patt) & (number.length === 10)) {
    return true;
  } else {
    return false;
  }
};

// format phone number
formatPhoneNumber = (phoneNumberString) => {
  let cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
};

renderContacts = (contacts) => {
  contact_list_el.innerHTML = '';

  contacts.forEach((contact) => {
    const div = document.createElement('li');
    div.setAttribute('id', 'accordion');
    div.innerHTML = `<h4 class="contact-name">${
      contact.first_name + ' ' + contact.last_name
    } </h4>
      <div class="contact-info">
        <p>
          <span><i class="fa fa-phone" aria-hidden="true"></i></span>
          <span>${contact.telephone}</span>
        </p>
        <p><i class="fa fa-home" aria-hidden="true"></i>${contact.address}</p>
        <button class="delete">Delete</button>
      </div>
    `;

    contact_list_el.append(div);
  });
};

//_________DELETE CONTACT_________//
