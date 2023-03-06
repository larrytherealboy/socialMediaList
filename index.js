const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users";
const USER_PER_PAGE = 15

const users = [];
let filterUsers = []

const dataPanel = document.querySelector("#data-panel");
const paginator = document.querySelector("#paginator")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const userModelBody = document.querySelector("#user-model-body")
const addFriendButton = document.querySelector("#add-friend-button")

// 函式：顯示所有user名字與頭像
function renderUserList(data) {
  rawHTML = ``;
  data.forEach((item) => {
    rawHTML += `<div class="col mb-2" id="card">
      <div class="card sm-3" style="width: 9rem; height: 12rem;">
        <img src="${item.avatar}" class="card-img-top" data-bs-toggle="modal" data-bs-target="#user-model" data-id=${item.id} alt="...">
        <div class="card-body d-flex justify-content-center">
          <h6 class="card-title">${item.name}</h6>
        </div>
      </div>
    </div>`;
  });

  dataPanel.innerHTML = rawHTML;
}

// 函式：顯示 user詳細資料
function showUserModel(id) {
  const userModelImage = document.querySelector("#user-model-image");
  const userModelFullname = document.querySelector("#user-model-fullname");
  const userModelGender = document.querySelector("#user-model-gender");
  const userModelAge = document.querySelector("#user-model-age");
  const userModelBirthday = document.querySelector("#user-model-birthday");
  const userModelRegion = document.querySelector("#user-model-region");
  const userModelEmail = document.querySelector("#user-model-email");

  axios
    .get(INDEX_URL + "/" + id)
    .then(function (response) {
      const data = response.data;
      console.log(data);

      userModelImage.innerHTML = `<img src=${data.avatar} alt="user-poster"
                class="image-fluid">`;
      userModelFullname.innerText = data.name + " " + data.surname;
      userModelGender.innerText = "Gender: " + data.gender;
      userModelAge.innerText = "Age: " + data.age;
      userModelBirthday.innerText = "Birthday: " + data.birthday;
      userModelRegion.innerText = "Region: " + data.region;
      userModelEmail.innerText = "Email: " + data.email;
      addFriendButton.dataset.id = id
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

// 函式：顯示總頁數
function renderPaginator(amount) {
  const pages = Math.ceil(amount / USER_PER_PAGE)
  let rawHTML = ``
  for (let page = 1; page <= pages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

// 函式：依據分頁將資料分成每頁15人
function userByPage(page) {
  const data = filterUsers.length ? filterUsers : users
  const startIndex = (page - 1) * USER_PER_PAGE
  return data.slice(startIndex, startIndex + USER_PER_PAGE)
}

// 函式：加好友
function addToFriend(id) {
  let list = JSON.parse(localStorage.getItem('friend')) || []
  let friend = users.find(user => user.id === id)

  if (list.some(user => user.id === id)) {
    return alert("You have already added this friend!")
  }

  list.push(friend)
  localStorage.setItem('friend', JSON.stringify(list))
}

// 監聽器：送出搜尋表單後，找尋含有關鍵字的user
searchForm.addEventListener('submit', function onFormSubmitted(event) {
  event.preventDefault()
  let inputValue = searchInput.value.trim().toLowerCase()
  filterUsers = users.filter(user => user.name.toLowerCase().includes(inputValue))
  renderPaginator(filterUsers.length)
  renderUserList(userByPage(1))
})

// 監聽器：點擊圖片顯示model
dataPanel.addEventListener("click", function onUserModel(event) {
  console.log(event.target);
  if (event.target.matches(".card-img-top")) {
    showUserModel(Number(event.target.dataset.id));
  }
});

// 監聽器：加好友
userModelBody.addEventListener('click', function onAddFriendButtonClicked(event) {
  if (event.target.matches(".btn-info")) {
    const id = Number(event.target.dataset.id)
    console.log(id)
    addToFriend(id)
  }
})

// 監聽器：點擊分頁顯示該頁user
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName === 'A') {
    const page = Number(event.target.innerText)
    renderUserList(userByPage(page))
  }
})

// 抓取API資料到 users
axios
  .get(INDEX_URL)
  .then(function (response) {
    users.push(...response.data.results);
    renderPaginator(users.length)
    renderUserList(userByPage(1));
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
