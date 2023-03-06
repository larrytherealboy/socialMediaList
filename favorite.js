const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users";
const USER_PER_PAGE = 15

const users = JSON.parse(localStorage.getItem('friend'))
let filterUsers = []

const dataPanel = document.querySelector("#data-panel");
const paginator = document.querySelector("#paginator")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const userModelFooter = document.querySelector(".modal-footer")
const removeFriendButton = document.querySelector("#remove-friend-button")

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

      userModelImage.innerHTML = `<img src=${data.avatar} alt="user-poster"
                class="image-fluid">`;
      userModelFullname.innerText = data.name + " " + data.surname;
      userModelGender.innerText = "Gender: " + data.gender;
      userModelAge.innerText = "Age: " + data.age;
      userModelBirthday.innerText = "Birthday: " + data.birthday;
      userModelRegion.innerText = "Region: " + data.region;
      userModelEmail.innerText = "Email: " + data.email;
      removeFriendButton.dataset.id = id
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

// 函式：刪好友
function removeFriend(id) {
  // 如果名單空白，不執行
  if (!users || !users.length) return

  const userIndex = users.findIndex(user => user.id === id)
  users.splice(userIndex, 1)
  renderPaginator(users.length)
  renderUserList(userByPage(1))

  localStorage.setItem('friend', JSON.stringify(users))
}

// 監聽器：點擊圖片顯示model
dataPanel.addEventListener("click", function onUserModel(event) {
  if (event.target.matches(".card-img-top")) {
    showUserModel(Number(event.target.dataset.id));
  }
});

// 監聽器：刪除好友
userModelFooter.addEventListener('click', function onRemoveFriendButtonClicked(event) {
  if (event.target.matches(".btn-danger")) {
    const id = Number(event.target.dataset.id)
    removeFriend(id)
  }
})

// 監聽器：點擊分頁顯示該頁user
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName === 'A') {
    const page = Number(event.target.innerText)
    renderUserList(userByPage(page))
  }
})

renderUserList(userByPage(1))
renderPaginator(users.length)
