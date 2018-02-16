// dev path
const path = 'http://localhost:3000';
// prod path
// const path = '';


//***EVENT LISTENERS***
// HOME nav
document.querySelector('#home').addEventListener('click', homeNav);
document.querySelector('#home').addEventListener('touchstart', homeNav);

// NEW MOOD ENTRY nav
document.querySelector('#new-entry').addEventListener('click', newEntryNav);
document.querySelector('#new-entry').addEventListener('touchstart', newEntryNav);

//ALL MOODS nav
document.querySelector('#all-moods').addEventListener('click', allMoodsNav);
document.querySelector('#all-moods').addEventListener('touchstart', allMoodsNav);

// DROPDOWN filter
document.querySelector('.dropdown-menu').addEventListener('click', dropdownClick);
document.querySelector('.dropdown-menu').addEventListener('touchstart', dropdownClick);

// NEW ENTRY button
document.querySelector('#submitNewMood').addEventListener('click', newEntryNav);
document.querySelector('#submitNewMood').addEventListener('touchstart', newEntryNav);

// Selecting Options
document.querySelector('.time-options').addEventListener('click', selectOptionItem);
document.querySelector('.time-options').addEventListener('touchstart', selectOptionItem);
document.querySelector('.mood-options').addEventListener('click', selectOptionItem);
document.querySelector('.mood-options').addEventListener('touchstart', selectOptionItem);
document.querySelector('.toy-options').addEventListener('click', selectOptionItem);
document.querySelector('.toy-options').addEventListener('touchstart', selectOptionItem);
document.querySelector('.food-options').addEventListener('click', selectOptionItem);
document.querySelector('.food-options').addEventListener('touchstart', selectOptionItem);

// SUBMIT MOOD button
// ['click', 'touchend'].forEach(eventType => {
//   document.querySelector('#submit').addEventListener(eventType, submitReport)
// })
document.querySelector('#submit').addEventListener('click', submitReport)
document.querySelector('#submit').addEventListener('touchend', submitReport)
document.querySelector('#submit').addEventListener('keydown', function() {
  if (event.key === 'Enter') {
    submitReport();
  }
})



//***ROUTES***
let reportsData = [];
let reports;
let latestMood;
let latestTimeOfDay;
let latestUserId;
let latestToyId;
let latestFoodId;
let timestamp;

const separator = '-'
let userFirstName;
let userLastName;
let formatTitle;

// GET homepage data
axios.get(`${path}/reports`)
  .then(res => {
    // let reports = res.data
    reports = res.data
    let last = reports[reports.length-1];
    // console.log(res)
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

/*
************************
// GET all users
axios.get(`${path}/users`)
  .then(res => {
    // console.log(res.data);

    const users = res.data
    users.forEach(user => {
      let userElement = document.createElement('div')
      userElement.textContent = `First Name: ${user.first_name}
                                  Last Name: ${user.last_name}
                                  `
      document.querySelector('#userList').appendChild(userElement)
    })


  })
  .catch(err => {
    console.log('ERROR!', err);
  })
************************
  */

// GET user by ID
// axios.get(`${path}/users/${id}`)
//   .where('id', id)
//   .then(res => {
//     console.log(res.data);
//     const users = res.data
//     users.forEach(user => {
//       let userElement = document.createElement('div')
//       userElement.textContent = `First Name: ${user.first_name}
//                                   Last Name: ${user.last_name}
//                                   `
//       document.querySelector('#userList').appendChild(userElement)
//     })
//   })
//   .catch(err => {
//     console.log('ERROR!', err);
//   })

//GET all toys
// axios.get(`${path}/toys`)
//   .then(res => {
//     // console.log('toys?', res.data);
//
//     const toys = res.data
//     toys.forEach(toy => {
//       let toyElement = document.createElement('div')
//       toyElement.textContent = `Toy ID: ${toy.id}
//                                   Name: ${toy.name}
//                                   `
//       document.querySelector('#userList').appendChild(toyElement)
//     })
//   })
//   .catch(err => {
//     console.log('ERROR!', err);
//   })

//GET all foods
// axios.get(`${path}/foods`)
//   .then(res => {
//     // console.log('foods?', res.data);
//
//     const foods = res.data
//     foods.forEach(food => {
//       let foodElement = document.createElement('div')
//       foodElement.textContent = `Food ID: ${food.id}
//                                   Name: ${food.name}
//                                   `
//       document.querySelector('#userList').appendChild(foodElement)
//     })
//   })
//   .catch(err => {
//     console.log('ERROR!', err);
//   })

//GET reports_toys
// axios.get(`${path}/reports-toys`)
//   .then(res => {
//     // console.log('reportsToys?', res.data);
//
//     const reportsToys = res.data
//     reportsToys.forEach(repToy => {
//       let repToyElement = document.createElement('div')
//       repToyElement.textContent = `id: ${repToy.id}
//                                   reports_id: ${repToy.reports_id}
//                                   toys_id: ${repToy.toys_id}
//                                   `
//       document.querySelector('#userList').appendChild(repToyElement)
//     })
//   })
//   .catch(err => {
//     console.log('ERROR!', err);
//   })

// GET reports_foods
// axios.get(`${path}/reports-foods`)
//   .then(res => {
//     console.log('reportsFoods?', res.data);
//
//     const reportsFoods = res.data
//     reportsFoods.forEach(repFood => {
//       let repFoodElement = document.createElement('div')
//       repFoodElement.textContent = `id: ${repFood.id}
//                                   reports_id: ${repFood.reports_id}
//                                   foods_id: ${repFood.foods_id}
//                                   `
//       document.querySelector('#userList').appendChild(repFoodElement)
//     })
//   })
//   .catch(err => {
//     console.log('ERROR!', err);
//   })


// function returnDetailData(arr) {
   // let promiseArr = arr.map((item) => {
   //    item = [id, endpoint];
   //    return axios.get(...url/item);
   //  })
//   ....
//
//   return Promise.all(promiseArr);
// }



//***FUNCTIONS***
// *HOMEPAGE*
function homeNav(event) {
  // event.preventDefault();
  document.querySelector('.home-container').style.display = "";
  document.querySelector('.report-container').style.display = "none";

  updateAverageMood();
  updateLatestMood();
}

function updateAverageMood(event) {
    console.log('saved reportsData', reportsData)


}

function updateLatestMood(event) {
  document.querySelector('.lastDate').textContent = `${latestTimestamp}`;
  document.querySelector('.lastUser').textContent = `User: ${latestUserId}`;
  document.querySelector('.lastTimeOfDay').textContent = `Time of Day: ${latestTimeOfDay}`;
  document.querySelector('.lastMood').textContent = `Mood: ${latestMood}`;
  document.querySelector('.lastToy').textContent = `Toy: ${latestToyId}`;
  document.querySelector('.lastFood').textContent = `Food: ${latestFoodId}`;
}

// *NEW ENTRIES*
function newEntryNav(event) {
  // event.preventDefault();
  document.querySelector('.home-container').style.display = "none";
  document.querySelector('.report-container').style.display = "block";
  document.querySelector('.page-title').textContent = "Seen Mossy lately? Report her latest mood below.";
  document.querySelector('.view-all').style.display = "none";
  document.querySelector('.submit-new').style.display = "block";
  document.querySelector('#submit').disabled = false;

  if (document.querySelector('.alert-success')) {
    document.querySelector('.alert-success').style.display = "none";
  }
}

let firstFormatted;
let lastFormatted;
function submitReport(event) {
  // event.preventDefault();
  //format user name
  let dataFirstName = document.querySelector('#firstName').value;
  let dataLastName = document.querySelector('#lastName').value;
  formatUserName(dataFirstName, dataLastName, firstName, lastName);

  // id new data
  let time_of_day = document.querySelector('.time-options .selected p').textContent;
  let mood = document.querySelector('.mood-options .selected p').textContent;
  let toys_id = document.querySelector('.toy-options .selected').toy_id;
  let foods_id = document.querySelector('.food-options .selected').food_id;

  let newData = {
    firstName: firstFormatted,
    lastName: lastFormatted,
    time_of_day,
    mood,
    toys_id,
    foods_id,
  };

  axios.post(`${path}/reports`, newData).then(result => {
    console.log(result.data.result);
  })

  console.log('newData', newData);

  document.querySelector('#submit').disabled = true;

  let successElement = document.createElement('div')
  successElement.textContent = "Success!";
  successElement.className = "alert alert-success";
  document.querySelector('.submit-new').appendChild(successElement);
}

function formatUserName(dataFirstName, dataLastName, firstName, lastName) {
  firstFormatted = dataFirstName.charAt(0).toUpperCase() + dataFirstName.slice(1).toLowerCase();
  lastFormatted = dataLastName.charAt(0).toUpperCase() + dataLastName.slice(1).toLowerCase();

  console.log('firstlast???', firstFormatted, lastFormatted)
}


// *VIEW ALL MOODS*
function allMoodsNav(event) {
  // event.preventDefault();

  // clear previous table data
  clearTables();

  document.querySelector('.home-container').style.display = "none";
  document.querySelector('.report-container').style.display = "block";
  document.querySelector('.page-title').textContent = "";
  document.querySelector('.view-all').style.display = "block";
  document.querySelector('.submit-new').style.display = "none";
  getAllReports();
  updateAverageMood();
}

let rowCount = 0;
function getAllReports() {
  axios.get(`${path}/reports`)
    .then(res => {
      // let reports = res.data
      reports = res.data

      console.log('moods list', reports)

      // list all reports
      reports.forEach(report => {
        // reportsData.push(report);
        // let shortTimestamp;

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

        //number rows
        rowCount++;
        console.log('rowcount', rowCount)

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

        // let reportElement = document.createElement('div')
        // reportElement.textContent = `
        //                             Mood: ${report.mood}
        //                             Time of day: ${report.time_of_day}
        //                             User: ${report.users_id}
        //                             Toy: ${report.toys_id}
        //                             Food: ${report.foods_id}
        //                             Timestamp: ${report.created_at}
        //                             `
        // document.querySelector('#moodsList').appendChild(reportElement)
      })
    })
    .catch(err => {
      console.log('ERROR!', err);
    })
}

function dropdownClick(event) {
  // clear previous table data
  clearTables();
  // let tableBody = document.querySelector('tbody')
  // while (tableBody.childNodes.length) {
  //   tableBody.removeChild(tableBody.lastChild);
  // }

  //get event info
  console.log('what was clicked', event.target)
  let clickId = event.target.id
  // console.log(clickId)

  // update table title
  splitString(clickId, separator)
  document.querySelector('.selection-title').textContent = `${formatTitle}`;

  // update table data
  if (clickId == 'All-Users') {
    getAllReports();
  } else {
    // filterReportsByUser();
  }

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
  console.log('what was clicked', event.target)
  let workingTarget;

  if (event.target.nodeName === 'DIV') {
    workingTarget = event.target;
  } else {
    workingTarget = event.target.parentNode;
  }

  let parentNode = workingTarget.parentNode;
  let childNodes = parentNode.childNodes;

  childNodes.forEach(child => {
    // console.log(child);
    if (child.classList) {
      child.classList.remove('selected');
    }
  })
  workingTarget.classList.toggle('selected');

  // console.log('YEP', document.querySelector('.time-options .selected p').textContent);
}

const eggPlant = document.querySelector('#toy-eggplant');
eggPlant.toy_id = 1;
const weedBall = document.querySelector('#toy-ball');
weedBall.toy_id = 2;
const otherToy = document.querySelector('#toy-other');
otherToy.toy_id = 3;
const noToy = document.querySelector('#toy-none');
noToy.toy_id = 4;

const bacon = document.querySelector('#Bacon');
bacon.food_id = 1;
const treats = document.querySelector('#food-treats');
treats.food_id = 2;
const otherFood = document.querySelector('#food-other');
otherFood.food_id = 3;
const noFood = document.querySelector('#food-none');
noFood.food_id = 4;

/*
********** TO DO **********
-ajax join tables
-push submit data to backend
  *validate user
  *normalize first&last before adding to badkend
  *add error all must have selections
-required fields not blocking submit anymore
-count populate average moods on home
-filter and add data to table
*/


///backend get sql max query
