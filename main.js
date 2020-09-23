const BASE_URL = "https://movie-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/movies/"
const POSTER_URL = BASE_URL + "/posters/"
const MOVIES_PER_PAGE = 12

const movies = []
let filterMovies = []


const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

function renderMovieList(data) {
  let rawHTML = ''
  //title,image
  data.forEach(element => {
    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img src='${POSTER_URL + element.image}'
              class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${element.title}</h5>
            </div>
            <div class="card-footer ">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal"
                data-target="#movie-modal" data-id='${element.id}'>More</button>
              <button class="btn btn-info btn-add-favorite" data-id='${element.id}'>+</button>
            </div>
          </div>
        </div>
      </div>`
  });
  dataPanel.innerHTML = rawHTML

}

function addToFavorite(id) {
  // console.log(id)
  function isMoviesId(movie) {
    return movie.id === id
  }
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(isMoviesId)

  if (list.some(movie => movie.id === id)) {
    return alert('此電影已經在收藏清單中!!')
  }

  list.push(movie)
  // console.log(list)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
  // console.log(movie)
  // console.log(JSON.stringify(movie))
}


function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    //data-page 綁超連結
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page='${page}'>${page}</a></li>`
  }

  paginator.innerHTML = rawHTML
}
//page -->
function getMoviesByPage(page) {
  //movies ? 'movies' : 'filtermovies'
  const data = filterMovies.length ? filterMovies : movies

  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}


function showMovieModa(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then(response => {
    //response.data.results
    const data = response.data.results
    modalTitle.innerHTML = data.title
    modalDate.innerHTML = 'Release date: ' + data.release_date
    modalDescription.innerHTML = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster"
      class='img-fluid'>`
  })

}

dataPanel.addEventListener('click', function onPanelClick(event) {
  if (event.target.matches('.btn-show-movie')) {
    // console.log(event.target.dataset)
    showMovieModa(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  // <a> </a>
  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page))

})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  // if (!keyword.length) {
  //   return alert('Please enter valid string') 
  // }
  //匿名函示只有return 一行  return可省略
  filterMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))
  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filterMovies.push(movie)
  //   }
  // }
  if (filterMovies.length === 0) {
    return alert('Cannot not find movies with keyword: ' + keyword)
  }
  renderPaginator(filterMovies.length)
  renderMovieList(getMoviesByPage(1))

})

axios.get(INDEX_URL).then(response => {
  //Array(80)
  // for (const movie of response.data.results) {
  //   movies.push(movie)
  // }

  // //方法一
  // movies.push(1, 2, 3); //傳入 3 個參數：1,2,3
  // //方法二
  // movies.push(...[1, 2, 3]); //把陣列用展開運算子打開，打開後就和方法一一模一樣
  // //方法三
  // const numbers = [1, 2, 3]; //做一個陣列
  // movies.push(...numbers); //和方法二同樣意思

  movies.push(...response.data.results)
  //用指定的會指定參數出去 有可能會修改到原先陣列 所以不好 且const 不能用指定放進去
  // let test = response.data.results 
  // console.log(test)
  renderPaginator(movies.length)
  renderMovieList(getMoviesByPage(1))
}).catch(error => { console.log(error) })

