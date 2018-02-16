// dev path
const path = 'http://localhost:3000';
// prod path
// const path = '';


/***ON LOAD***/
let reports;
let latestMood;
let latestTimeOfDay;
let latestUserId;
let latestToyId;
let latestFoodId;
let timestamp;
let rowCount = 0;
let formatTitle;
const separator = '-'
let userFirstName;
let userLastName;
let firstFormatted;
let lastFormatted;

// load homepage
loadHomepage();


/***EVENT LISTENERS***/
// HOME nav
document.querySelector('#home').addEventListener('click', homeNav);
document.querySelector('#home').addEventListener('touchstart', homeNav);

// ADD NEW MOOD nav
document.querySelector('#new-entry').addEventListener('click', newEntryNav);
document.querySelector('#new-entry').addEventListener('touchstart', newEntryNav);

//ALL MOODS nav
document.querySelector('#all-moods').addEventListener('click', allMoodsNav);
document.querySelector('#all-moods').addEventListener('touchstart', allMoodsNav);

// SUBMIT NEW MOOD homepage
document.querySelector('#submitNewMood').addEventListener('click', newEntryNav);
document.querySelector('#submitNewMood').addEventListener('touchstart', newEntryNav);

// SUBMIT MOOD form
document.querySelector('#submit').addEventListener('click', submitReport)
document.querySelector('#submit').addEventListener('touchend', submitReport)
document.querySelector('#submit').addEventListener('keydown', function() {
  if (event.key === 'Enter') {
    submitReport();
  }
})

// REPORTS Dropdown Filter
document.querySelector('.dropdown-menu').addEventListener('click', dropdownClick);
document.querySelector('.dropdown-menu').addEventListener('touchstart', dropdownClick);

// SELECT SUBMIT MOOD Option
document.querySelector('.time-options').addEventListener('click', selectOptionItem);
document.querySelector('.time-options').addEventListener('touchstart', selectOptionItem);
document.querySelector('.mood-options').addEventListener('click', selectOptionItem);
document.querySelector('.mood-options').addEventListener('touchstart', selectOptionItem);
document.querySelector('.toy-options').addEventListener('click', selectOptionItem);
document.querySelector('.toy-options').addEventListener('touchstart', selectOptionItem);
document.querySelector('.food-options').addEventListener('click', selectOptionItem);
document.querySelector('.food-options').addEventListener('touchstart', selectOptionItem);


/***FUNCTIONS***/
function homeNav(event) {
  document.querySelector('.home-container').style.display = "";
  document.querySelector('.report-container').style.display = "none";

  loadHomepage();
}

function loadHomepage() {
  axios.get(`${path}/reports`)
    .then(res => {
      // let reports = res.data
      reports = res.data
      let last = reports[reports.length-1];

      console.log('reports', reports)
      latestMood = last.mood;
      latestTimeOfDay = last.time_of_day;
      latestUserId = `${last.first_name} ${last.last_name}`;
      latestToyId = last.toys_id;
      latestFoodId = last.foods_id;
      const latestTimestampRaw = last.created_at;
      latestTimestamp = latestTimestampRaw.slice(0, 10);

      // update average moods
      updateAverageMood()
      // update latest mood conatiner
      updateLatestMood()
    })
    .catch(err => {
      console.log('ERROR!', err);
    })
}

function updateAverageMood(event) {
  axios.get(`${path}/averagemoods`)
    .then(res => {
      let avgMoods = res.data;
      let happyImg = "/images/mossy/happy-mossy1.png";
      let indifferentImg = "/images/mossy/indifferent-mossy2.jpg";
      let sassyImage = "/images/mossy/sassy-mossy.jpg";
      let morningImg = document.querySelector('.avg-morning');
      let afternoonImg = document.querySelector('.avg-afternoon');
      let eveningImg = document.querySelector('.avg-evening');
      let avgMorning = avgMoods.Morning.mood;
      let avgAfternoon = avgMoods.Afternoon.mood;
      let avgEvening = avgMoods.Evening.mood;

      // populate morning avg
      document.querySelector('.avg-morning')
      if (avgMorning) {
        if (avgMorning == 'Happy') {
          morningImg.src = `${happyImg}`
        }
        if (avgMorning == 'Indifferent') {
          morningImg.src = `${indifferentImg}`
        }
        if (avgMorning == 'Sassy') {
          morningImg.src = `${sassyImage}`
        }
        document.querySelector('.morning-p').textContent = avgMorning;
      }
      // populate afternoon avg
      document.querySelector('.avg-afternoon')
      if (avgAfternoon) {
        if (avgAfternoon == 'Happy') {
          afternoonImg.src = `${happyImg}`
        }
        if (avgAfternoon == 'Indifferent') {
          afternoonImg.src = `${indifferentImg}`
        }
        if (avgAfternoon == 'Sassy') {
          afternoonImg.src = `${sassyImage}`
        }
        document.querySelector('.afternoon-p').textContent = avgAfternoon;
      }
      // populate evening avg
      document.querySelector('.avg-evening')
      if (avgEvening) {
        if (avgEvening == 'Happy') {
          eveningImg.src = `${happyImg}`
        }
        if (avgEvening == 'Indifferent') {
          eveningImg.src = `${indifferentImg}`
        }
        if (avgEvening == 'Sassy') {
          eveningImg.src = `${sassyImage}`
        }
        document.querySelector('.evening-p').textContent = avgEvening;
      }

    })
    .catch(err => {
      console.log('ERROR!', err);
    })
}

function updateLatestMood(event) {
  document.querySelector('.lastDate').textContent = `${latestTimestamp}`;
  document.querySelector('.lastUser').textContent = `User: ${latestUserId}`;
  document.querySelector('.lastTimeOfDay').textContent = `Time of Day: ${latestTimeOfDay}`;
  document.querySelector('.lastMood').textContent = `Mood: ${latestMood}`;
  document.querySelector('.lastToy').textContent = `Toy: ${latestToyId}`;
  document.querySelector('.lastFood').textContent = `Food: ${latestFoodId}`;
}

function newEntryNav(event) {
  document.querySelector('.home-container').style.display = "none";
  document.querySelector('.report-container').style.display = "block";
  document.querySelector('.page-title').textContent = "Seen Mossy lately? Report her latest mood below.";
  document.querySelector('.view-all').style.display = "none";
  document.querySelector('.submit-new').style.display = "block";
  document.querySelector('#submit').disabled = false;

  // clear selected classes
  let selectedItems = document.getElementsByClassName('selected');
  while (selectedItems.length) {
    selectedItems[0].classList.remove('selected');
  }
  // remove success message
  if (document.querySelector('.alert-success')) {
    document.querySelector('.alert-success').style.display = "none";
  }
  // remove error message
  if (document.querySelector('.alert-danger')) {
    document.querySelector('.alert-danger').style.display = "none";
  }
}

function submitReport(event) {
  // event.preventDefault();

  //format user name
  let dataFirstName = document.querySelector('#firstName').value;
  let dataLastName = document.querySelector('#lastName').value;
  formatUserName(dataFirstName, dataLastName, firstName, lastName);

  // identify new submit data
  let time_of_day = document.querySelector('.time-options .selected p');
  let mood = document.querySelector('.mood-options .selected p');
  let toys_id = document.querySelector('.toy-options .selected');
  let foods_id = document.querySelector('.food-options .selected');

  // check if all options contain a selection
  if (time_of_day && mood && toys_id && foods_id && dataFirstName && dataLastName) {
    let newData = {
      firstName: firstFormatted,
      lastName: lastFormatted,
      time_of_day: time_of_day.textContent,
      mood: mood.textContent,
      toys_id: toys_id.toy_id,
      foods_id: foods_id.food_id,
    };
    // post data to backend
    axios.post(`${path}/reports`, newData).then(result => {
      console.log('post', result.data.result);

      if (result.data.result) {
        // display submit success
        document.querySelector('#submit').disabled = true;
        let errorMessage = document.querySelector('.alert-danger');
        errorMessage.style.display = "none";

        let successElement = document.createElement('div')
        successElement.textContent = "Success!";
        successElement.className = "alert alert-success";
        document.querySelector('.submit-new').appendChild(successElement);

        event.preventDefault();
      }
    });
  }
  else {
    if (document.querySelector('.alert-danger')) {
      let errorMessage = document.querySelector('.alert-danger')
      // document.querySelector('.alert-danger').style.display = "none";
      document.querySelector('.submit-new').removeChild(errorMessage)
    }

    // display error
    let errorElement = document.createElement('div')
    errorElement.textContent = "Please complete all selections.";
    errorElement.className = "alert alert-danger";
    document.querySelector('.submit-new').appendChild(errorElement)

    event.preventDefault();
  }
}

function formatUserName(dataFirstName, dataLastName, firstName, lastName) {
  firstFormatted = dataFirstName.charAt(0).toUpperCase() + dataFirstName.slice(1).toLowerCase();
  lastFormatted = dataLastName.charAt(0).toUpperCase() + dataLastName.slice(1).toLowerCase();
}

function allMoodsNav(event) {
// clear previous table data
  clearTables();

  document.querySelector('.home-container').style.display = "none";
  document.querySelector('.report-container').style.display = "block";
  document.querySelector('.page-title').textContent = "";
  document.querySelector('.view-all').style.display = "block";
  document.querySelector('.submit-new').style.display = "none";
  getAllReports();
  populateDropdown();
}

function getAllReports() {
  axios.get(`${path}/reports`)
    .then(res => {
      reports = res.data

      console.log('moods list', reports)

      // list all reports
      reports.forEach(report => {
        rowCount++;
        const timestampRaw = report.created_at;
        let shortTimestamp = timestampRaw.slice(0, 10);

        let newTableRow = document.createElement('tr');
        let newTableDataNumber = document.createElement('td');
        let newTableDataFirst = document.createElement('td');
        let newTableDataLast = document.createElement('td');
        let newTableDataTimeOfDay = document.createElement('td');
        let newTableDataMood = document.createElement('td');
        let newTableDataToy = document.createElement('td');
        let newTableDataFood = document.createElement('td');
        let newTableDataTimestamp = document.createElement('td');

        newTableDataNumber.textContent = `${rowCount}`;
        newTableDataFirst.textContent = `${report.first_name}`;
        newTableDataLast.textContent = `${report.last_name}`;
        newTableDataTimeOfDay.textContent = `${report.time_of_day}`;
        newTableDataMood.textContent = `${report.mood}`;
        newTableDataToy.textContent = `${report.toys_id}`;
        newTableDataFood.textContent = `${report.foods_id}`;
        newTableDataTimestamp.textContent = `${shortTimestamp}`;

        newTableRow.appendChild(newTableDataNumber);
        newTableRow.appendChild(newTableDataFirst);
        newTableRow.appendChild(newTableDataLast);
        newTableRow.appendChild(newTableDataTimeOfDay);
        newTableRow.appendChild(newTableDataMood);
        newTableRow.appendChild(newTableDataToy);
        newTableRow.appendChild(newTableDataFood);
        newTableRow.appendChild(newTableDataTimestamp);
        document.querySelector('tbody').appendChild(newTableRow);
      })
    })
    .catch(err => {
      console.log('ERROR!', err);
    })
}

function dropdownClick(event) {
  // clear previous table data
  clearTables();
  //get event info
  console.log('what was clicked', event.target)
  let clickId = event.target.id
  //populate users in dropdown
  populateDropdown();

  // update table title
  splitString(clickId, separator)
  document.querySelector('.selection-title').textContent = `${formatTitle}`;

  // update table data
  if (clickId == 'All-Users') {
    getAllReports();
  } else {
    filterReportsByUser();
  }

}

function populateDropdown() {
  axios.get(`${path}/users`)
    .then(res => {
      let users = res.data;
      // sort users
      let sortingArray = [];
      let sortedArray = [];

      users.forEach(user => {
        sortingArray.push(`${user.first_name} ${user.last_name}`);
      })
      let sortUsers = sortingArray.sort();

      sortUsers.forEach(user => {
        let splitUser = user.split(" ");
        sortedArray.push({first_name: `${splitUser[0]}`, last_name: `${splitUser[1]}`})
      })

      // clear users
      let dropdown = document.querySelector('.dropdown-menu')
      while (dropdown.childNodes.length >= 3) {
        dropdown.removeChild(dropdown.lastChild);
      }

      // add all users to dropdown
      sortedArray.forEach(user => {
        let newDropdownItem = document.createElement('a');
        newDropdownItem.id = `${user.first_name}-${user.last_name}`;
        newDropdownItem.className = 'dropdown-item';
        newDropdownItem.href = '#';
        newDropdownItem.textContent = `${user.first_name} ${user.last_name}`;

        document.querySelector('.dropdown-menu').appendChild(newDropdownItem);
      });
    })
    .catch(err => {
      console.log('ERROR!', err);
    })
}

function filterReportsByUser() {
  let splitTitle = formatTitle.split(" ");
  let user = {first_name: `${splitTitle[0]}`, last_name: `${splitTitle[1]}`}

  axios.get(`${path}/reports`)
    .then(res => {
      matchingReports = res.data.filter(report => {
        return report.first_name === user.first_name &&
          report.last_name === user.last_name;
      });

      // list all reports for user
      matchingReports.forEach(report => {
        rowCount++;
        const timestampRaw = report.created_at;
        let shortTimestamp = timestampRaw.slice(0, 10);

        let newTableRow = document.createElement('tr');
        let newTableDataNumber = document.createElement('td');
        let newTableDataFirst = document.createElement('td');
        let newTableDataLast = document.createElement('td');
        let newTableDataTimeOfDay = document.createElement('td');
        let newTableDataMood = document.createElement('td');
        let newTableDataToy = document.createElement('td');
        let newTableDataFood = document.createElement('td');
        let newTableDataTimestamp = document.createElement('td');

        newTableDataNumber.textContent = `${rowCount}`;
        newTableDataFirst.textContent = `${report.first_name}`;
        newTableDataLast.textContent = `${report.last_name}`;
        newTableDataTimeOfDay.textContent = `${report.time_of_day}`;
        newTableDataMood.textContent = `${report.mood}`;
        newTableDataToy.textContent = `${report.toys_id}`;
        newTableDataFood.textContent = `${report.foods_id}`;
        newTableDataTimestamp.textContent = `${shortTimestamp}`;

        newTableRow.appendChild(newTableDataNumber);
        newTableRow.appendChild(newTableDataFirst);
        newTableRow.appendChild(newTableDataLast);
        newTableRow.appendChild(newTableDataTimeOfDay);
        newTableRow.appendChild(newTableDataMood);
        newTableRow.appendChild(newTableDataToy);
        newTableRow.appendChild(newTableDataFood);
        newTableRow.appendChild(newTableDataTimestamp);
        document.querySelector('tbody').appendChild(newTableRow);
      })
    })
    .catch(err => {
      console.log('ERROR!', err);
    })
}

function clearTables() {
  rowCount = 0;
  let tableBody = document.querySelector('tbody')
  while (tableBody.childNodes.length) {
    tableBody.removeChild(tableBody.lastChild);
  }
}

function splitString(clickId, separator) {
  let dropDownTitle = clickId.split(separator);
  userFirstName = `${dropDownTitle[0]}`;
  userLastName = `${dropDownTitle[1]}`
  formatTitle = `${userFirstName} ${userLastName}`;
}

function selectOptionItem(event) {
  let targetClicked = event.target
  console.log('what was clicked', event.target)
  console.log('what was clicked', event.target.nodeName)
  let workingTarget;

  // add border to selected option
  // if (targetClicked.classList.contains('col-sm')) {
  //   targetClicked.classList.toggle('selected')
  //   let parents = targetClicked.parentNode;
  //   let children = parents.childNodes;
  //   children.forEach(child => {
  //     if (child.classList) {
  //       child.classList.remove('selected');
  //     }
  //   })
  //   targetClicked.classList.toggle('selected');
  // }

  if (targetClicked.nodeName === 'DIV' && targetClicked.classList.contains('col-sm')) {
    workingTarget = targetClicked;
    workingTarget.classList.toggle('selected');
    let parentNode = workingTarget.parentNode;
    let childNodes = parentNode.childNodes;

    childNodes.forEach(child => {
      if (child.classList) {
        child.classList.remove('selected');
      }
    })
    workingTarget.classList.toggle('selected');
  } else if (targetClicked.nodeName === 'IMG' || targetClicked.nodeName === 'P') {
    workingTarget = targetClicked.parentNode;
    workingTarget.classList.toggle('selected');
    let parentNode = workingTarget.parentNode;
    let childNodes = parentNode.childNodes;

    childNodes.forEach(child => {
      if (child.classList) {
        child.classList.remove('selected');
      }
    })
    workingTarget.classList.toggle('selected');
  }

  // let parentNode = workingTarget.parentNode;
  // let childNodes = parentNode.childNodes;
  //
  // childNodes.forEach(child => {
  //   if (child.classList) {
  //     child.classList.remove('selected');
  //   }
  // })
  // workingTarget.classList.toggle('selected');
}

// set selected item ID
const eggplant = document.querySelector('#toy-eggplant');
eggplant.toy_id = 1;
const weedBall = document.querySelector('#toy-ball');
weedBall.toy_id = 2;
const otherToy = document.querySelector('#toy-other');
otherToy.toy_id = 3;
const noToy = document.querySelector('#toy-none');
noToy.toy_id = 4;

const bacon = document.querySelector('#food-bacon');
bacon.food_id = 1;
const treats = document.querySelector('#food-treats');
treats.food_id = 2;
const otherFood = document.querySelector('#food-other');
otherFood.food_id = 3;
const noFood = document.querySelector('#food-none');
noFood.food_id = 4;
