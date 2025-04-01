// Parámetros globales
var currentPage, searchQuery, itemsPerPage = 12, lastPostDate = null, type, lblname1;

function getSearchQuery() {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("q") || "";
}

// Función para manejar la paginación de todas las entradas
function paginationall(data) {
    let totalResults = parseInt(data.feed.openSearch$totalResults.$t, 10);
    // Si no se obtiene el total correctamente, podemos usar un valor por defecto
    if (isNaN(totalResults)) {
        totalResults = 0;
    }
    // Llamamos a la función de paginación pasándole el total de entradas
    pagination(totalResults);
}

// Función para la paginación de la portada (usando el total de entradas)
function bloggerpage() {
    let activePage = window.location.href;

    // Si estamos en la portada, ajustamos la URL de la solicitud para obtener todas las publicaciones
    if (!activePage.includes("?q=") && !activePage.includes(".html") && activePage.indexOf("/search/label/") === -1) {
        type = "page";
        currentPage = activePage.includes("#PageNo=") ? parseInt(activePage.substring(activePage.indexOf("#PageNo=") + 8), 10) : 1;

        // Aseguramos de que estamos obteniendo el total de publicaciones y no solo una
        document.write(`<script src="${home_page}feeds/posts/summary?max-results=9999&alt=json-in-script&callback=paginationall"></script>`);
    } else {
        // Si no estamos en la portada, tratamos como una búsqueda o etiqueta
        type = "label";
        if (!activePage.includes("&max-results=")) {
            itemsPerPage = 12;
        }
        currentPage = activePage.includes("#PageNo=") ? parseInt(activePage.substring(activePage.indexOf("#PageNo=") + 8), 10) : 1;

        // Petición para obtener las entradas de la etiqueta
        document.write(`<script src="${home_page}feeds/posts/summary/-/${lblname1}?alt=json-in-script&callback=paginationall&max-results=9999"></script>`);
    }
}

function createPageLink(pageNum, linkText) {
    let searchParam = searchQuery ? `q=${encodeURIComponent(searchQuery)}` : "";
    let labelParam = lblname1 ? `search/label/${lblname1}` : "search";
    let startIndex = (pageNum - 1) * itemsPerPage;
    let url = `${window.location.origin}/${labelParam}?${searchParam}` +
              `&updated-max=${encodeURIComponent(lastPostDate || new Date().toISOString())}&max-results=${itemsPerPage}&start=${startIndex}&by-date=false#PageNo=${pageNum}`;

    return `<span class="pagenumber"><a href="${url}">${linkText}</a></span>`;
}

function paginationall(data) {
    let totalResults = parseInt(data.feed.openSearch$totalResults.$t, 10);
    if (data.feed.entry && data.feed.entry.length > 0) {
        lastPostDate = data.feed.entry[data.feed.entry.length - 1].updated.$t;
    } else if (!lastPostDate) {
        lastPostDate = new Date().toISOString();
    }
    pagination(totalResults);
}

function bloggerpage() {
    searchQuery = getSearchQuery();
    let activePage = window.location.href;

    if (activePage.includes("/search/label/")) {
        type = "label";
        lblname1 = activePage.split("/search/label/")[1].split("?")[0];
    } else if (searchQuery) {
        type = "search";
    } else {
        type = "page";
    }

    currentPage = activePage.includes("#PageNo=") 
        ? parseInt(activePage.split("#PageNo=")[1]) 
        : 1;

    let scriptUrl = type === "search"
        ? `${home_page}feeds/posts/summary?max-results=1&alt=json-in-script&callback=paginationall`
        : `${home_page}feeds/posts/summary/-/${lblname1}?max-results=1&alt=json-in-script&callback=paginationall`;

    let script = document.createElement("script");
    script.src = scriptUrl;
    document.body.appendChild(script);
}

document.addEventListener("DOMContentLoaded", bloggerpage);
