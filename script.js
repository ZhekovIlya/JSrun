const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster = 'https://image.tmdb.org/t/p/w500';
var options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

function apiSearch(event) {
    event.preventDefault();
    const searchText = document.querySelector('.form-control').value;
    if (searchText.trim().length === 0) {
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</h2>'
        return;
    }

    movie.innerHTML = '<div class="spinner"></div>';
    fetch('https://api.themoviedb.org/3/search/multi?api_key=311a0462e9d1a3c4dcbe170fe1d8c0b3&language=ru&query=' + searchText)
        .then(function (value) {
            if (value.status !== 200) {
                return Promise.reject(new Error(value));
            }
            return value.json();
        })
        .then(function (output) {
            fillMovieOutput(output, '');
            addEventMedia();
        })
        .catch(function (reason) {
            movie.innerHTML = 'Упс, что-то пошло не так!';
            console.log('error: ' + reason);
        });

}
searchForm.addEventListener('submit', apiSearch);

function fillMovieOutput(output, inner) {
    let resultToFill = inner;
    if (output.results.length === 0) {
        resultToFill = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>';
    };
    output.results.forEach(element => {
        let nameItem = element.name || element.title;
        let releaseDate = element.first_air_date || element.release_date;
        const poster = element.poster_path ? urlPoster + element.poster_path : './img/noPoster.jpg';
        let dataInfo = '';
        if (element.media_type !== 'person') {
            let mediaType = element.title ? 'movie' : 'tv';
            dataInfo = `data-id="${element.id}" 
            data-type="${mediaType}"`;
        }
        resultToFill += `
        <div class="col-6 col-md-4 col-xl-3 item">
        <img src="${poster}" class="img_poster" alt="${nameItem}" ${dataInfo}>
        <h5> ${nameItem}</h5> 
        &nbsp
        ${new Date(releaseDate).toLocaleDateString("ru-Ru", options)}
        </div>`;

    });
    movie.innerHTML = resultToFill;
}

function showMovieInfo(media) {
    media.forEach(function (elem) {
        elem.style.cursor = 'pointer';
        elem.addEventListener('click', showFullInfo);
    });
}

function addEventMedia() {
    const media = movie.querySelectorAll('img[data-id]');
    showMovieInfo(media);
}

function showFullInfo() {
    let url = '';

    if (this.dataset.type === 'movie') {
        url = `https://api.themoviedb.org/3/movie/${this.dataset.id}?api_key=311a0462e9d1a3c4dcbe170fe1d8c0b3&language=ru`;
    } else if (this.dataset.type === 'tv') {
        url = `https://api.themoviedb.org/3/tv/${this.dataset.id}?api_key=311a0462e9d1a3c4dcbe170fe1d8c0b3&language=ru`;
    } else {
        movie.innerHTML = '<h2 class="col-12 text-center text-info">Произошла ошибка повторите позже!</h2>';
    }
    fetch(url)
        .then(function (value) {
            if (value.status !== 200) {
                return Promise.reject(new Error(value));
            }
            return value.json();
        })
        .then(function (output) {
            console.log(output);
            movie.innerHTML = `
            <h4 class="col-12 text-center text-info">${output.name || output.title}</h4>
            <div class="col-4">
            <img src='${urlPoster+output.poster_path}' alt='${output.name || output.title}'>
            ${(output.homepage)?`<p class='text-center'> <a href="${output.homepage}" target="_blank"> Официальная страница </a></p>`:''}
            ${(output.imdb_id)?`<p class='text-center'> <a href="https://imdb.com/title/${output.imdb_id}" target="_blank"> Страница на IMDB.com </a></p>`:''}
            </div>
            <div class="col-8">
            <p> Описание: ${output.overview}</p>
            <p> Рейтинг: ${output.vote_average}</p>
            <p> Статус: ${output.status}</p>
            <p> Премьера: ${output.first_air_date || output.release_date}</p>

            ${(output.last_episode_to_air)? `<p>${output.number_of_seasons} сезон ${output.last_episode_to_air.episode_number} серий вышло</p>`:''}
            </div>`
        })
        .catch(function (reason) {
            movie.innerHTML = 'Упс, что-то пошло не так!';
            console.log('error: ' + reason);
        });
    console.log(url);
}

document.addEventListener('DOMContentLoaded', function () {
    let inner = '<h4 class="col-12 text-center text-info">Популярное за неделю!</h4>';
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=311a0462e9d1a3c4dcbe170fe1d8c0b3&language=ru')
        .then(function (value) {
            if (value.status !== 200) {
                return Promise.reject(new Error(value));
            }
            return value.json();
        })
        .then(function (output) {
            fillMovieOutput(output, inner);
            addEventMedia();
        })
        .catch(function (reason) {
            movie.innerHTML = 'Упс, что-то пошло не так!';
            console.log('error: ' + reason);
        });
})