// Parámetros globales
var currentPage, searchQuery, itemsPerPage = 12, lastPostDate = null, type, lblname1;

function getSearchQuery() {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("q") || "";
}

function pagination(totalPosts) {
    let paginationHTML = "";
    let leftnum = Math.floor(pagesToShow / 2);

    // Ajuste de pagesToShow si es necesario
    if (leftnum === pagesToShow - leftnum) {
        pagesToShow = 2 * leftnum + 1;
    }

    // Calcular el rango de páginas
    let start = currentPage - leftnum;
    start = Math.max(start, 1); // Garantiza que el inicio no sea menor que 1

    let maximum = Math.floor(totalPosts / itemsPerPage) + 1;
    if (maximum * itemsPerPage === totalPosts) {
        maximum -= 1;
    }

    let end = start + pagesToShow - 1;
    end = Math.min(end, maximum); // Garantiza que el final no sea mayor que el máximo

    paginationHTML += `<span class='totalpages'>Hoja ${currentPage} de ${maximum}</span>`;

    // Enlace a la página anterior
    let previousPage = currentPage > 1 ? createPageLink(currentPage - 1, prevpage, type) : "";
    paginationHTML += previousPage;

    // Enlace a la página 1
    if (start > 1) {
        paginationHTML += type === "page"
            ? `<span class="pagenumber"><a href="${home_page}">1</a></span>`
            : `<span class="pagenumber"><a href="/search/label/${lblname1}?&max-results=${itemsPerPage}">1</a></span>`;
    }

    if (start > 2) paginationHTML += "...";

    // Generar las páginas intermedias
for (let r = start; r <= end; r++) {
    if (r === parseInt(currentPage, 10)) {
        paginationHTML += `<span class="pagenumber current">${r}</span>`;
    } else {
        paginationHTML += createPageLink(r, r, type);
    }
}

    if (end < maximum - 1) paginationHTML += "...";

    // Enlace para la última página
    if (end < maximum) paginationHTML += createPageLink(maximum, maximum, type);

    // Enlace a la siguiente página
    let nextPage = currentPage < maximum ? createPageLink(currentPage + 1, nextpage, type) : "";
    paginationHTML += nextPage;

    // Actualizar el área de la página
    let pageArea = document.getElementsByName("pageArea");
    let pagerElement = document.getElementById("blog-pager");

    for (let i = 0; i < pageArea.length; i++) {
        pageArea[i].innerHTML = paginationHTML;
    }

    if (pagerElement) {
        pagerElement.innerHTML = paginationHTML;
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

// Función para manejar la paginación de todas las entradas
function paginationall(data) {
    let totalResults = parseInt(data.feed.openSearch$totalResults.$t, 10);
    pagination(totalResults);
}

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

document.addEventListener("DOMContentLoaded", bloggerpage);
