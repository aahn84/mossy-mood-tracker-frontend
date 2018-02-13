console.log("DOM fully loaded and parsed");
// console.log('AXIOS!', axios)


//USERS
axios.get('http://localhost:3000/users')
  .then(res => {
    console.log(res.data);
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
// axios.get('http://localhost:3000/users/:id')
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


// REPORTS
axios.get('http://localhost:3000/reports')
  .then(res => {
    let reports = res.data
    reports.forEach(report => {
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
