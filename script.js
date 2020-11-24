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

// append new contacts to this element
let contact_list_el = document.querySelector('.contact_list');

// input to search contacts
let search_input = document.querySelector('#search_input');

//___________________________//

//______ON WINDOW LOAD______//

//__________________________//

// initial request to fetch contacts from local storage
myLoad = () => {
  let list = JSON.parse(localStorage.getItem('contacts')) || [];
  renderContacts(list);
};

//___________________________//

//_____OPEN CLOSE MODAL_____//

//___________________________//

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

// creating and adding contact to localstorage
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

// remove error message styling on input
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

  newContact['address'] =
    address.value.charAt(0).toUpperCase() +
    address.value.slice(1).toLowerCase().trim();

  newContact['telephone'] = formatPhoneNumber(telephone.value);

  return newContact;
};

// function to add contacts to local storage
addToLocalStorage = (contacts) => {
  localStorage.setItem('contacts', JSON.stringify(contacts));
  renderContacts(contacts);
};

// validate phone number
validateTelephone = (number) => {
  let patt = new RegExp(
    /^\+?1?\s*?\(?\d{3}(?:\)|[-|\s])?\s*?\d{3}[-|\s]?\d{4}$/
  );
  if (number.match(patt)) {
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

// render contacts on the page
renderContacts = (contacts) => {
  contact_list_el.innerHTML = '';

  contacts.forEach((contact) => {
    const div = document.createElement('div');
    div.setAttribute('id', 'accordion');
    div.innerHTML = `
      <h4 class="contact_name">${contact.first_name + ' ' + contact.last_name} 
      </h4>
      <div class="contact_info">
        <p>
          <span><i class="fa fa-phone" aria-hidden="true"></i></span>
          <span>${contact.telephone}</span>
        </p>
        <p>
          <span><i class="fa fa-home" aria-hidden="true"></i></span>
          <span>${contact.address}</span>
        </p>
        <button class="delete_contact"><i class="fa fa-trash-o"></i></button>
      </div>
    `;

    contact_list_el.append(div);
  });
};

//__________________________//

//______DELETE CONTACT______//

//_________________________//

document.addEventListener('click', function (e) {
  if (e.target && e.target.classList[0] === 'delete_contact') {
    let nodes = Array.prototype.slice.call(
      e.target.parentElement.parentElement.parentElement.children
    );
    let index = nodes.indexOf(e.target.parentElement.parentElement);
    deleteItem(index);
  }
});

deleteItem = (index) => {
  let storage_history = JSON.parse(localStorage.getItem('contacts'));
  storage_history.splice(index, 1);
  addToLocalStorage(storage_history);
};

//__________________________//

//______SEARCH CONTACT______//

//_________________________//

search_input.addEventListener('input', function (e) {
  let storage_history = JSON.parse(localStorage.getItem('contacts'));
  let filtered_list = storage_history.filter((obj) => {
    return obj.first_name.toLowerCase().includes(e.target.value.toLowerCase());
  });
  renderContacts(filtered_list);
});
