// const newMemberAddBtn = document.querySelector(".addMemberBtn");
const darkBg = document.querySelector(".dark_bg");
const popupForm = document.querySelector(".popup");
const crossBtn = document.querySelector(".closeBtn");
// const submitBtn = document.querySelector(".submitBtn");
const modalTitle = document.querySelector(".modalTitle");
const popupFooter = document.querySelector(".popupFooter");
// const imgHolder = document.querySelector(".imgholder");
const form = document.querySelector("form");
const formInputFields = document.querySelectorAll("form input");
// const uploadimg = document.querySelector("#uploadimg");
const imgInput = document.querySelector(".img");

const entries = document.querySelector(".showEntries");
const tabSize = document.getElementById("table_size");
const userInfo = document.querySelector(".userInfo");
const table = document.querySelector("table");
const filterData = document.getElementById("search");

let isEdit = false;
let editId;
let submitAction;
let selectedPriceHeader;

var arrayLength = 0;
var tableSize = 10;
var startIndex = 1;
var endIndex = 0;
var currentIndex = 1;
var maxIndex = 0;

// DATABASE
let originalData;
let getData;
let headers;
let priceHeaders;
let productDetailHeader;
let customHeaders;

const CRUD_API8 = 'AKfycbyLtfFP_Ba8CM3Aiz1kKfPjQZf3c7ZWedAM2zFGiOEd2Cei0Ptas3DdiiODUv1oq6o';
const CRUD_API9 = 'AKfycbzldvcYea-Blruh0PncCVQrtqL0tYiwGRvNMkIucx4JRIbAEvKdht3Bv8IB8GbeJDfY';
const API_URL = `https://script.google.com/macros/s/${CRUD_API9}/exec`;

async function getSheetData(query = '') {
  const READ_API_URL = API_URL + `?path=Sheet1&action=read&query=${query}`
  const jsonResponse = await fetch(READ_API_URL);
  const response = await jsonResponse.json();
  return response.data;
}

/**
 * FUNCTIONS FOR GETTING STARTED
 */

// has getData
function preLoadCalculations() {
  array = getData;
  arrayLength = array.length;
  maxIndex = arrayLength / tableSize;

  if (arrayLength % tableSize > 0) {
    maxIndex++;
  }
}

function displayIndexBtn() {
  preLoadCalculations();

  const pagination = document.querySelector(".pagination");
  pagination.innerHTML = "";
  pagination.innerHTML = '<button onclick="prev()" class="prev">Previous</button>';

  for (let i = 1; i <= maxIndex; i++) {
    pagination.innerHTML +=
      '<button onclick= "paginationBtn('+ i +')" index="'+ i +'">'+ i +"</button>";
  }

  pagination.innerHTML += '<button onclick="next()" class="next">Next</button>';
  highlightIndexBtn();
}

function highlightIndexBtn() {
  startIndex = (currentIndex - 1) * tableSize + 1;
  endIndex = startIndex + tableSize - 1;

  if (endIndex > arrayLength) {
    endIndex = arrayLength;
  }
  if (maxIndex >= 2) {
    var nextBtn = document.querySelector(".next");
    nextBtn.classList.add("act");
  }

  entries.textContent = `Showing ${startIndex} to ${endIndex} of ${arrayLength} entries`;
  var paginationBtns = document.querySelectorAll(".pagination button");
  paginationBtns.forEach((btn) => {
    btn.classList.remove("activePage");
    if (btn.getAttribute("index") === currentIndex.toString()) {
      btn.classList.add("activePage");
    }
  });

  showInfo();
}

// has getData
function showInfo() {

  const trHead = document.querySelector(".heading");
  userInfo.innerHTML = "";
  trHead.innerHTML = "";

  // display header
  // trHead.innerHTML += `<th>SL No</th>`;
  customHeaders.forEach((header, index) => {
    trHead.innerHTML += `
      <th class="col">${header}</td>
    `;
  });

  // add td => tr body
  var tab_start = startIndex - 1;
  var tab_end = endIndex;

  if (getData.length > 0) {
    for (var i = tab_start; i < tab_end; i++) {
      var staff = getData[i];

      if (staff) {
        let rowData = [];
        const rowDataHTML = customHeaders.map((header) => {
          const cellData = staff[header];
          rowData.push(cellData);
          return `<td>${cellData}</td>`;
        });

        let createElement = `
          <tr class = "employeeDetails">
            ${rowDataHTML.join('')}
            <td>
              <button onclick="editInfo('${staff.name}')"><i class="fa-regular fa-pen-to-square"></i></button><button onclick = "deleteInfo('${staff.name}')"><i class="fa-regular fa-trash-can"></i></button>
            </td>
          </tr>
        `;

        userInfo.innerHTML += createElement;
        // table.style.minWidth = "760px";
      }

      // if (staff) {
      //   let rowData = '';
      //   customHeaders.forEach((header, index) => {
      //     const cellData = staff[header];
      //     if(index === 1) {rowData += `<td class="col-4">${cellData}</td>`} 
      //     else {rowData += `<td class="col">${cellData}</td>`}

      //     // rowData += `<td>${cellData}</td>`;
      //   });

      //   let createElement = `
      //     <tr class = "employeeDetails">
      //       ${rowData}
      //       <td>
      //         <button onclick="editInfo('${staff.name}')"><i class="fa-regular fa-pen-to-square"></i></button><button onclick = "deleteInfo('${staff.name}')"><i class="fa-regular fa-trash-can"></i></button>
      //       </td>
      //     </tr>
      //   `;

      //   userInfo.innerHTML += createElement;
      //   // table.style.minWidth = "760px";
      // }
    }
  
  } else {
    userInfo.innerHTML = `
        <tr class="employeeDetails">
            <td class="empty" colspan="11" align="center">
                No data available in table
            </td>
        </tr>
    `;

    // table.style.minWidth = "760px";
  }
}

{/* <button onclick="readInfo('${staff.name}')"><i class="fa-regular fa-eye"></i></button> */}
// showInfo(getData)

/**
 * FUNCTIONS FOR NEW MEMBER
 */

function populateFormInputs() {
  const inputField = document.querySelector(".inputFieldContainer");
  inputField.innerHTML = '';

  customHeaders.forEach((header) => {
    inputField.innerHTML += `
      <div class="form_control">
          <label for="${header}">${header}: </label>
          <input type="number" name="${header}" id="${header}">
      </div>
    `;
  });

  // exception id=name
  document.querySelector(`#${customHeaders[0]}`).setAttribute("type", "text");
}

// close form
crossBtn.addEventListener("click", closeForm);
function closeForm() {
  darkBg.classList.remove("active");
  popupForm.classList.remove("active");

}


// uploadimg.onchange = function () {
//   if (uploadimg.files[0].size < 1000000) {
//     // 1MB = 1000000
//     var fileReader = new FileReader();

//     fileReader.onload = function (e) {
//       var imgUrl = e.target.result;
//       imgInput.src = imgUrl;
//     };

//     fileReader.readAsDataURL(uploadimg.files[0]);
//   } else {
//     alert("This file is too large!");
//   }
// };

// open view form
function readInfo(name) {
  const matchingProduct = getData.find((row) => row.name === name);
  if (!matchingProduct) {
    // return "name not found";
    notifyBootstrap('name not found', 'alert-danger');
  }

  customHeaders.forEach((header) => {
    document.querySelector(`#${header}`).value = matchingProduct[header];
  });
  // imgInput.src = "";
  // addActionButton(name)

  darkBg.classList.add("active");
  popupForm.classList.add("active");
  popupFooter.style.display = "none";
  modalTitle.innerHTML = "Profile";
  formInputFields.forEach((input) => {
    input.disabled = true;
  });

  // imgHolder.style.pointerEvents = "none";
}

// open add form
// newMemberAddBtn.addEventListener("click", () => {
//   submitAction = 'create'
//   isEdit = false;
//   // submitBtn.innerHTML = "Submit";
//   modalTitle.innerHTML = "Fill the Form";
//   popupFooter.style.display = "block";
//   // imgInput.src = "";

//   darkBg.classList.add("active");
//   popupForm.classList.add("active");
// });

// open edit form
// has originalData
function editInfo(name) {
  isEdit = true
  // editId = id
  submitAction = 'update';

  const matchingProduct = getData.find((row) => row.name === name);
  if (!matchingProduct) {
    console.log("name not found");
  }

  customHeaders.forEach((header) => {
    document.querySelector(`#${header}`).value = matchingProduct[header];
  });

  // imgInput.src = "";

  darkBg.classList.add('active')
  popupForm.classList.add('active')
  popupFooter.style.display = "block"
  modalTitle.innerHTML = "Update the Form"
  // submitBtn.innerHTML = "Update"
  formInputFields.forEach(input => {
      input.disabled = false
  })

  // imgHolder.style.pointerEvents = "auto"
}

// has userprofile
// has originalData
// has getData
async function deleteInfo(name) {
  if (confirm(`Are you sure want to delete "${name}"?`)) {
    const deleteQuery =  `?action=delete&path=Sheet1&name=${name}`
    const json = await fetch(API_URL + deleteQuery)
    const response = await json.json();

    // await loadWebsite();
    originalData = await getSheetData();
    getData = [...originalData];
    showInfo()

    if(response.data[0] === name) {
      notifyBootstrap(`${name} removed`, 'alert-success')
    } else {
      notifyBootstrap(`cannot delete ${name}`, 'alert-danger')
    }

    // var nextBtn = document.querySelector(".next");
    // var prevBtn = document.querySelector(".prev");

    // if (Math.floor(maxIndex) > currentIndex) {
    //   nextBtn.classList.add("act");
    // } else {
    //   nextBtn.classList.remove("act");
    // }

    // if (currentIndex > 1) {
    //   prevBtn.classList.add("act");
    // }
  }
}

/**
 * OTHER FUNCTIONS
 */

function next() {
  var prevBtn = document.querySelector(".prev");
  var nextBtn = document.querySelector(".next");

  if (currentIndex <= maxIndex - 1) {
    currentIndex++;
    prevBtn.classList.add("act");

    highlightIndexBtn();
  }

  if (currentIndex > maxIndex - 1) {
    nextBtn.classList.remove("act");
  }
}

function prev() {
  var prevBtn = document.querySelector(".prev");

  if (currentIndex > 1) {
    currentIndex--;
    prevBtn.classList.add("act");
    highlightIndexBtn();
  }

  if (currentIndex < 2) {
    prevBtn.classList.remove("act");
  }
}

function paginationBtn(i) {
  currentIndex = i;

  var prevBtn = document.querySelector(".prev");
  var nextBtn = document.querySelector(".next");

  highlightIndexBtn();

  if (currentIndex > maxIndex - 1) {
    nextBtn.classList.remove("act");
  } else {
    nextBtn.classList.add("act");
  }

  if (currentIndex > 1) {
    prevBtn.classList.add("act");
  }

  if (currentIndex < 2) {
    prevBtn.classList.remove("act");
  }
}

tabSize.addEventListener("change", () => {
  var selectedValue = parseInt(tabSize.value);
  tableSize = selectedValue;
  currentIndex = 1;
  startIndex = 1;
  displayIndexBtn();
});

// has userpofile
// has getData
// has originalData

filterData.addEventListener("input", () => {
  const searchTerm = filterData.value.toLowerCase().trim();

  if (searchTerm !== "") {
    const filteredData = originalData.filter((item) => {
      // const fullName = (item.fName + " " + item.lName).toLowerCase()
      // const city = item.cityVal.toLowerCase()
      // const position = item.positionVal.toLowerCase()
      const name = item.name.toLowerCase();

      return (
        // fullName.includes(searchTerm) ||
        // city.includes(searchTerm) ||
        // position.includes(searchTerm)
        name.includes(searchTerm)
      );
    });

    // Update the current data with filtered data
    getData = filteredData;
  } else {
    getData = originalData;
  }

  currentIndex = 1;
  startIndex = 1;
  displayIndexBtn();
});

// Function to show a fading alert using Bootstrap
function notifyBootstrap(text, status) {
  // Create Bootstrap alert element
  const alertElement = document.createElement('div');
  alertElement.innerHTML = `
    <div class="alert ${status} fade show">
      <strong>${text}</strong>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
  
  // Append alert element to the container
  document.getElementById('bootstrap-alert-container')
    .appendChild(alertElement);

  // Initialize Bootstrap alert for fade-in effect
  new bootstrap.Alert(alertElement);

  // Automatically fade out after 2 seconds
  setTimeout(() => {
    alertElement.classList.remove('show');
  }, 2000);

  // Remove the alert element from the DOM after fade-out
  setTimeout(() => {
    alertElement.remove();
  }, 2500);
}

// SUBMIT ADD ITEM
document.getElementById('new-item-btn')
  .addEventListener('click', () => {
    submitAction = 'create'

})

const addItemForm = document.getElementById('add-item-form');
addItemForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  
  // Submit data to server
  const formData = new FormData(addItemForm);
  const query = `?path=Sheet1&action=${submitAction}&` + new URLSearchParams(formData).toString()
  const json = await fetch(API_URL + query);
  const response = await json.json();

  // Display success / fail notification
  const name = Object.fromEntries(formData).name
  const succeed = response.data[0] === name;
  if(succeed) {notifyBootstrap(`${name} ${submitAction}d`, 'alert-success')}
  else {notifyBootstrap(`${submitAction} ${name} failed`, 'alert-danger')}

  // Reload data
  originalData = await getSheetData();
  getData = [...originalData];
  displayIndexBtn()
})

// submit form data
const formEl = document.querySelector('.submit-form');
formEl.addEventListener('submit', async (e) => {
  e.preventDefault()
  closeForm();

  // Submit data to server
  const formData = new FormData(formEl);
  const query = `?path=Sheet1&action=${submitAction}&` + new URLSearchParams(formData).toString()
  const json = await fetch(API_URL + query);
  const response = await json.json();

  // Display success / fail notification
  const name = Object.fromEntries(formData).name
  const succeed = response.data[0] === name;
  if(succeed) {notifyBootstrap(`${name} ${submitAction}d`, 'alert-success')}
  else {notifyBootstrap(`${submitAction} ${name} failed`, 'alert-danger')}

  // Reload data
  originalData = await getSheetData();
  getData = [...originalData];
  displayIndexBtn()
  form.reset()
})

function openQueryModal() {
  const queryModal = new bootstrap.Modal(document.getElementById('queryModal'));
  queryModal.show()
}

async function loadWebsite() {
  originalData = await getSheetData();
  getData = [...originalData];
  headers = Object.keys(getData[0]);
  separateHeader(headers);

  populateQuerySelection()
  openQueryModal()
  await waitUserSelect()

  customHeaders = [...productDetailHeader, selectedPriceHeader]
  displayIndexBtn();
  populateFormInputs();
  populateAddItemFormInputs();
}

function populateQuerySelection() {
  const selectionWrap = document.querySelector('.js-radio-selection-wrap')
  const selectionEl = priceHeaders.map(header => {
    return `
      <input type="radio" class="btn-check" name="btnradio" id="radio-${header}" value="${header}" autocomplete="off">
      <label class="btn btn-outline-primary" for="radio-${header}">${header}</label>
    `
  })

  selectionWrap.innerHTML = selectionEl.join('');
}

const timeout = async (ms) => new Promise(resolve => setInterval(resolve, ms))
async function waitUserSelect() {
  while (!selectedPriceHeader) await timeout(500);

}

document.querySelector('.js-select-price-btn')
  .addEventListener('click', () => {
    const selectedColor = document.querySelector('input[name="btnradio"]:checked').value;
    selectedPriceHeader = selectedColor;

})


function separateHeader(headers) {
  priceHeaders = headers.filter(item => item.endsWith('1'))
  productDetailHeader = headers.filter(item => !item.endsWith('1'))
  // return [productDetailHeader, priceHeaders]
}

function populateAddItemFormInputs() {
  const addItemWrap = document.querySelector('.js-add-item-wrap');

  productDetailHeader.forEach(header => {
    addItemWrap.innerHTML += `
      <div class="input-group mb-3">
        <span class="input-group-text">${header}</span>
        <input type="text" name="${header}" class="form-control" aria-label="Amount (to the nearest dollar)">
      </div>
    `  
  })

  priceHeaders.forEach(header => {
    addItemWrap.innerHTML += `
      <div class="input-group mb-3">
        <span class="input-group-text">${header}</span>
        <input type="number" name="${header}" class="form-control" aria-label="Amount (to the nearest dollar)">
        <span class="input-group-text">฿</span>
      </div>
    `
  })
}


loadWebsite();