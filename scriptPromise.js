const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
var options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

function apiSearch(event) {
    event.preventDefault();
    const searchText = document.querySelector('.form-control').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=311a0462e9d1a3c4dcbe170fe1d8c0b3&language=ru&query=' + searchText;
    movie.innerHTML = 'Загрузка';
    requestApi(server)
        .then(function (result) {
            const parsedResults = JSON.parse(result);
            fillMovieOutput(parsedResults);
        })
        .catch(function (reason) {
            movie.innerHTML = 'Упс, что-то пошло не так!';
            console.log('error: ' + request.status);
        });
}
searchForm.addEventListener('submit', apiSearch);

function requestApi(url) {
    return new Promise(function (resolve, reject) {
        const request = new XMLHttpRequest();
        request.open('GET', url);
        request.addEventListener('load', () => {
            if (request.status !== 200) {
                reject({
                    status: request.status
                });
                return;
            }
            resolve(request.response);
        });

        request.addEventListener('error', function () {
            reject({
                status: request.status
            });
        });
        request.send();


    });
    // request.addEventListener('readystatechange', () => {
    //     if (request.readyState !== 4) {
    //         movie.innerHTML = 'Загрузка';
    //         return;
    //     }
    //     if (request.status !== 200) {
    //         movie.innerHTML = 'Упс, что-то пошло не так!';
    //         console.log('error: ' + request.status);
    //         return;
    //     }

    // });
}

function fillMovieOutput(output) {
    let resultToFill = '';
    output.results.forEach(element => {
        console.log(element);
        let nameItem = element.name || element.title;
        let releaseDate = element.first_air_date || element.release_date;
        resultToFill += '<div class="col-12">' + nameItem + '  ||  Дата выхода: ' + new Date(releaseDate).toLocaleDateString("ru-Ru", options) + '</div>'


    });
    movie.innerHTML = resultToFill;
}