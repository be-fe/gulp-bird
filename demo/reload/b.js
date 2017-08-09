function setUserName() {
  const userName = document.getElementById('username').value;
  console.log(userName)
  localStorage.setItem('userName', userName)
}
alert('b.js');
