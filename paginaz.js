// Parámetros globales
var nopage, type, currentPage, lblname1, searchQuery, lastPostDate;

// Función para obtener el término de búsqueda del usuario
function getSearchQuery() {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("q") || ""; // Obtiene el valor de "q" o una cadena vacía si no existe
}

// Función principal de paginación
function pagination(totalPosts) {
    let paginationHTML = "";
    let leftnum = Math.floor(pagesToShow / 2);

    if (leftnum === pagesToShow - leftnum) {
        pagesToShow = 2 * leftnum + 1;
    }

    let start = Math.max(currentPage - leftnum, 1);
    let maximum = Math.ceil(totalPosts / itemsPerPage);
    let end = Math.min(start + pagesToShow - 1, maximum);

    paginationHTML += `<span class='totalpages'>Hoja ${currentPage} de ${maximum}</span>`;

    if (currentPage > 1) {
        paginationHTML += createPageLink(currentPage - 1, "Anterior", type);
    }

    if (start > 1) {
        paginationHTML += createPageLink(1, "1", type);
    }

    if (start > 2) paginationHTML += "...";

    for (let r = start; r <= end; r++) {
        paginationHTML += r === currentPage ? `<span class="pagenumber current">${r}</span>` : createPageLink(r, r, type);
    }

    if (end < maximum - 1) paginationHTML += "...";
    if (end < maximum) paginationHTML += createPageLink(maximum, maximum, type);

    if (currentPage < maximum) {
        paginationHTML += createPageLink(currentPage + 1, "Siguiente", type);
    }

    document.getElementById("blog-pager").innerHTML = paginationHTML;
}

// Genera enlaces de paginación con fecha actualizada
function createPageLink(pageNum, linkText, type) {
    let updatedMax = lastPostDate ? encodeURIComponent(lastPostDate) : getUpdatedMax(); 
    let searchParam = searchQuery ? `q=${encodeURIComponent(searchQuery)}` : "";
    let url = type === "page"
        ? `/search?${searchParam}&updated-max=${updatedMax}&max-results=${itemsPerPage}#PageNo=${pageNum}`
        : `/search/label/${lblname1}?updated-max=${updatedMax}&max-results=${itemsPerPage}#PageNo=${pageNum}`;
    return `<span class="pagenumber"><a href="${url}">${linkText}</a></span>`;
}

// Obtiene la fecha del último post de la página actual
function getLastPostDate(data) {
    if (data.feed.entry && data.feed.entry.length > 0) {
        lastPostDate = data.feed.entry[data.feed.entry.length - 1].published.$t; // Último post en la lista
    }
}

// Procesa los datos de Blogger
function paginationall(data) {
    let totalResults = parseInt(data.feed.openSearch$totalResults.$t, 10);
    getLastPostDate(data); // Obtener la fecha del último post
    pagination(totalResults);
}

// Determina el tipo de página y carga información
function bloggerpage() {
    let activePage = window.location.href;
    searchQuery = getSearchQuery(); // Obtiene la consulta de búsqueda del usuario

    if (activePage.includes("/search/label/")) {
        lblname1 = activePage.split("/search/label/")[1].split("?")[0];
        type = "label";
    } else {
        type = "page";
    }

    currentPage = activePage.includes("#PageNo=") ? parseInt(activePage.split("#PageNo=")[1]) : 1;
    let scriptUrl = type === "page"
        ? `${home_page}feeds/posts/summary?max-results=${itemsPerPage}&alt=json-in-script&callback=paginationall`
        : `${home_page}feeds/posts/summary/-/${lblname1}?alt=json-in-script&callback=paginationall&max-results=${itemsPerPage}`;

    let script = document.createElement("script");
    script.src = scriptUrl;
    document.body.appendChild(script);
}

// Redirigir a una página específica con fecha actualizada
function redirectpage(pageNum) {
    let updatedMax = lastPostDate ? encodeURIComponent(lastPostDate) : getUpdatedMax();
    let searchParam = searchQuery ? `q=${encodeURIComponent(searchQuery)}` : "";
    location.href = `/search?${searchParam}&updated-max=${updatedMax}&max-results=${itemsPerPage}#PageNo=${pageNum}`;
}

// Redirigir a una etiqueta específica con fecha actualizada
function redirectlabel(pageNum) {
    let updatedMax = lastPostDate ? encodeURIComponent(lastPostDate) : getUpdatedMax();
    location.href = `/search/label/${lblname1}?updated-max=${updatedMax}&max-results=${itemsPerPage}#PageNo=${pageNum}`;
}

// Inicialización
document.addEventListener("DOMContentLoaded", bloggerpage);
