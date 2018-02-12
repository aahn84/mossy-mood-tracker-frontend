console.log("DOM fully loaded and parsed");
// console.log('AXIOS!', axios)


//GET all users
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
