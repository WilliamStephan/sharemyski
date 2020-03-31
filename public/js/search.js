function renderStuff(item) {
    let view = $("<div>").addClass("row no-gutters border rounded overflow-hidden flex-md-row m-5 shadow-sm h-md-250 position-relative");
    let textBox = $("<div>").addClass("col p-4 d-flex flex-column position-static");
    textBox.append($("<h2>").text(item.description).addClass("mb-0"));
    textBox.append($("<p>").text("Listed by " + item.User.name).addClass("card-text mb-auto"));
    textBox.append($("<button>").text("Rent Now!").addClass("btn btn-primary"));
    let pictureBox = $("<div>").addClass("col-auto d-none d-lg-block");
    pictureBox.append($("<img>").attr({
        "src": item.image
    }));
    view.append(textBox);
    view.append(pictureBox);
    $("#stuffContainer").append(view);
}

$(document).ready(function () {

    var map = L.map('map').setView([lat, lng], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var skiIcon = L.divIcon({
        html: '🎿',
        className: 'my-div-icon'
    });
    var boardIcon = L.divIcon({
        html: '🏂',
        className: 'my-div-icon'
    });
    let marker = null;

    $.ajax({
        url: "/api/item",
        method: "GET"
    }).then(function (response) {
        response.forEach(e => {
            console.log(e);

            if (e.Category.description.includes("Board") || e.Category.description.includes("board")) {
                marker = boardIcon;
            } else {
                marker = skiIcon;
            }

            L.marker([e.lat, e.lng], {
                icon: marker
            }).addTo(map).bindPopup(`<a class="popup" data-id="${e.id}" href="/item/${e.id}">${e.description}</a>`);
        });
    });
});

$(document).on("click", ".popup", function (e) {
    e.preventDefault();
    let id = $(this).data("id");
    $.ajax({
        url: `/api/item/${id}`,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        $("#stuffContainer").empty();
        renderStuff(response);
    });
});