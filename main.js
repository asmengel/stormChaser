const key = '9cddf4547a3ac49b1bdd981f1459ec09';
const apiurl = "https://api.openweathermap.org/data/2.5/forecast?";

const STORE = {
    state: [],
    route: 'start',
    searchterm: null,
    data: null,
    currentsetting: 'today'
};

function handleFormSubmit() {
    $('.js-form').submit(function (event) {
        event.preventDefault();
        let searchterm = $(this).find(".js-input").val();
        $(this).find(".js-input").val("");
        STORE.searchterm = searchterm;
        if ($(this).hasClass('form-homepage')) {
            $(".js-start").addClass("hidden");
            $(".js-results").removeClass("hidden");
        }
        createApiRequest(searchterm);
    });
}

function handleSubmit() {
    $('.js-weather-button').on('click', function (event) {
        STORE.currentsetting = $(this).data('date');
        createHtml();
    });
}

function createApiRequest(searchterm) {
    let search = {
        q: searchterm,
        APPID: key
    };
    $.getJSON(apiurl, search, callback);
}

function createHtml() {
    let string = '';
    if (STORE.currentsetting === 'today') {
        string = generateToday();
    } else if (STORE.currentsetting === '3Day') {
        string = generateDay([0, 8, 16]);
    } else if (STORE.currentsetting === '5Day') {
        string = generateDay([0, 8, 16, 24, 32]);
    } else { console.log('There was an error') }
    renderHtml(string);
}

function renderHtml(string) {
    $('.js-results-container').html(string);
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function createDate(rawdata) {
    let dataArr = rawdata.split(" ");
    smallData = dataArr[0].split("-");
    let year = smallData[0];
    let month = smallData[1];
    switch (month) {
        case '01':
            month = "January";
            break;
        case '02':
            month = "February";
            break;
        case '03':
            month = "March";
            break;
        case '04':
            month = "April";
            break;
        case '05':
            month = "May";
            break;
        case '06':
            month = "June";
            break;
        case '07':
            month = "July";
            break;
        case '08':
            month = "August";
            break;
        case "09":
            month = "September";
            break;
        case '10':
            month = "October";
            break;
        case '11':
            month = "November";
            break;
        case '12':
            month = "December";
            break;
        default:
            break;
    };
    let day = smallData[2];
    if (day.charAt(0) === "0") {
        day = day.charAt(1);
    } else {
        day = day;
    }
    return `${month} ${day}, ${year}`;
}

function generateToday() {
    return `
    <div class="result-title">
        <h2>${toTitleCase(STORE.searchterm)}</h2>
    </div>
    <div class='today-result result'>
        <h2 class="today">Today</h2>
        <img src="https://openweathermap.org/img/w/${STORE.data.list[0].weather[0].icon}.png" alt+"weather pic" class="weather-icon">
        <p><b>${toTitleCase(STORE.data.list[0].weather[0].description)}</b> </p>
        <p><b>Temperature:</b> ${Math.floor((STORE.data.list[0].main.temp) * 9 / 5 - 459.67)} &#176F</p>
        <p><b>Humidity:</b> ${STORE.data.list[0].main.humidity}%</p>
        <p><b>Wind:</b> ${Math.floor((STORE.data.list[0].wind.speed) * 60 * 60 * 0.000621371)} mph</p>
     </div>
    `
}

function generateDay(dataArr) {
    $('.js-results-container').empty();
    $('.js-results-container').append(`<div class="result-title">
    <h2>${toTitleCase(STORE.searchterm)}</h2>
    </div>`);
    for (let i = 0; i < dataArr.length; i++) {
        let dayIndex = dataArr[i];
        $('.js-results-container').append(`
        <div class='future-result result'>
        <h2>${createDate(STORE.data.list[dayIndex].dt_txt)}</h2>
            <img src="https://openweathermap.org/img/w/${STORE.data.list[dayIndex].weather[0].icon}.png" alt+"weather pic" class="weather-icon">
            <p><b>${toTitleCase(STORE.data.list[dayIndex].weather[0].description)}</b> </p>
            <p><b>Temperature:</b> ${Math.floor((STORE.data.list[dayIndex].main.temp) * 9 / 5 - 459.67)} &#176F</p>
            <p><b>Humidity:</b> ${STORE.data.list[dayIndex].main.humidity}%</p>
            <p><b>Wind:</b> ${Math.floor((STORE.data.list[dayIndex].wind.speed) * 60 * 60 * 0.000621371)} mph</p>
         </div>
        `);
    }

}

function callback(data) {
    STORE.data = data;
    createHtml();
}

function main() {
    handleFormSubmit();
    handleSubmit();
}

$(main)
