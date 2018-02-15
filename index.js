console.log("DOM fully loaded and parsed");
// console.log('AXIOS!', axios)


const path = 'http://localhost:3000';

//***ROUTES***
//GET all users
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

//GET user by ID
// axios.get(`${path}/users/:id`)
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

let reports;
let latestMood;
let latestTimeOfDay;
let latestUserId;
let latestToyId;
let latestFoodId;
let timestamp;

let formData = {
  firstName: "",
  lastName: "",
}

// GET all report
axios.get(`${path}/reports`)
  .then(res => {
    // let reports = res.data
    reports = res.data
    let last = reports.length-1;
    // console.log(res)
    console.log('Reports!', reports)
    latestMood = reports[last].mood;
    latestTimeOfDay = reports[last].time_of_day;
    latestUserId = reports[last].users_id;
    latestToyId = reports[last].toys_id;
    latestFoodId = reports[last].foods_id;
    const latestTimestampRaw = reports[last].created_at;
    latestTimestamp = latestTimestampRaw.slice(0, 10);
    // console.log('stuff', latestMood, latestTimeOfDay, latestUserId, latestToyId, latestFoodId, latestTimestamp)

    // update average moods
    updateAverageMood(reports)
    // update latest mood conatiner
    updateLatestMood()

    // list all reports
    reports.forEach(report => {
      // mood = report.mood;
      // timeOfDay = report.time_of_day;
      // userId = report.users_id;
      // toyId = report.toys_id;
      // foodId = report.foods_id;
      // console.log('stuff', mood, timeOfDay, userId, toyId, foodId)

      let reportElement = document.createElement('div')
      // returnDetailData(report.user_id, ...)
      //   .then((responses) =>{
      //     // set all the dependant text content here
      //   })
      reportElement.textContent = `
                                  Mood: ${report.mood}
                                  Time of day: ${report.time_of_day}
                                  User: ${report.users_id}
                                  Toy: ${report.toys_id}
                                  Food: ${report.foods_id}
                                  `
      document.querySelector('#userList').appendChild(reportElement)
    })
  })
  .catch(err => {
    console.log('ERROR!', err);
  })


// POST new user
// axios.post(`${path}/users`) {
//   .then() {
//
//   }
//   .catch(err => {
//     console.log('ERROR!', err);
//   })
// }

// POST new report
// axios.post(`${path}/reports`, {
//     first_name: 'Fred',
//     last_name: 'Flintstone',
//     time_of_day: '',
//     mood: '',
//     toys_id: '',
//     foods_id: '',
//   })
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => {
//     console.log('ERROR!', err);
//   })

// console.log(mood, timeOfDay, userId, toyId, foodId)


// LATEST MOOD


// function returnDetailData(arr) {
   // let promiseArr = arr.map((item) => {
   //    item = [id, endpoint];
   //    return axios.get(...url/item);
   //  })
//   ....
//
//   return Promise.all(promiseArr);
// }

// TOYS




// FOODS



//***EVENT LISTENERS***
// HOME nav
document.querySelector('#home').addEventListener('click', homeNav)
document.querySelector('#home').addEventListener('touchstart', homeNav)

// NEW ENTRY nav
document.querySelector('#new-entry').addEventListener('click', newEntryNav)
document.querySelector('#new-entry').addEventListener('touchstart', newEntryNav)

// NEW ENTRY button
document.querySelector('#reportNewMood').addEventListener('click', newEntryNav)
document.querySelector('#reportNewMood').addEventListener('touchstart', newEntryNav)

// Selecting Options
document.querySelector('.time-options').addEventListener('click', selectOptionItem)
document.querySelector('.time-options').addEventListener('touchstart', selectOptionItem)
document.querySelector('.mood-options').addEventListener('click', selectOptionItem)
document.querySelector('.mood-options').addEventListener('touchstart', selectOptionItem)
document.querySelector('.toy-options').addEventListener('click', selectOptionItem)
document.querySelector('.toy-options').addEventListener('touchstart', selectOptionItem)
document.querySelector('.food-options').addEventListener('click', selectOptionItem)
document.querySelector('.food-options').addEventListener('touchstart', selectOptionItem)


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



//***FUNCTIONS***
function homeNav(event) {
  // event.preventDefault();
  document.querySelector('.home-container').style.display = "";
  document.querySelector('.report-container').style.display = "none";
}

function newEntryNav(event) {
  // event.preventDefault();
  document.querySelector('.home-container').style.display = "none";
  document.querySelector('.report-container').style.display = "block";
}

function updateAverageMood(event, reports) {
    console.log('???', reports)
    // document.querySelector('.lastDate').textContent = `${latestTimestamp}`;
}

function updateLatestMood(event) {
  document.querySelector('.lastDate').textContent = `${latestTimestamp}`;
  document.querySelector('.lastUser').textContent = `User: ${latestUserId}`;
  document.querySelector('.lastTimeOfDay').textContent = `Time of Day: ${latestTimeOfDay}`;
  document.querySelector('.lastMood').textContent = `Mood: ${latestMood}`;
  document.querySelector('.lastToy').textContent = `Toy: ${latestToyId}`;
  document.querySelector('.lastFood').textContent = `Food: ${latestFoodId}`;
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
}

function submitReport(event) {
  // event.preventDefault();
  console.log('DID IT!')
  let first = document.querySelector('#firstName').value
  let last = document.querySelector('#lastName').value
  alert(first)
  alert(last)



  // reset view to Homepage
  document.querySelector('.home-container').style.display = "";
  document.querySelector('.report-container').style.display = "none";
}
