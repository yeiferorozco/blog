// Configuración general
var itemsPerPage = 12; 
var pagesToShow = 5;
var currentPage, type, label, query, lastPostDate = null;

// Función para inicializar y detectar tipo de contexto
function initPagination() {
    let urlParams = new URLSearchParams(window.location.search);
    currentPage = window.location.href.includes("#PageNo=") ? parseInt(window.location.href.split("#PageNo=")[1]) : 1;

    if (window.location.href.includes("/search/label/")) {
        type = "label";
        label = decodeURIComponent(window.location.href.split("/search/label/")[1].split("?")[0]);
    } else if (urlParams.has("q")) {
        type = "search";
        query = urlParams.get("q");
    } else {
        type = "page";
    }

    // Obtener datos del feed
    let scriptUrl = `${window.location.origin}/feeds/posts/summary?max-results=1&alt=json-in-script&callback=handlePaginationData`;
    if (type === "label") {
        scriptUrl = `${window.location.origin}/feeds/posts/summary/-/${label}?max-results=1&alt=json-in-script&callback=handlePaginationData`;
    } else if (type === "search") {
        scriptUrl = `${window.location.origin}/feeds/posts/summary?max-results=1&q=${encodeURIComponent(query)}&alt=json-in-script&callback=handlePaginationData`;
    }

    let script = document.createElement("script");
    script.src = scriptUrl;
    document.body.appendChild(script);
}

// Función para manejar los datos obtenidos del feed
function handlePaginationData(data) {
    let totalPosts = parseInt(data.feed.openSearch$totalResults.$t, 10);

    if (data.feed.entry && data.feed.entry.length > 0) {
        lastPostDate = data.feed.entry[data.feed.entry.length - 1].updated.$t;
    }

    renderPagination(totalPosts);
}

// Función principal de renderizado de paginación
function renderPagination(totalPosts) {
    let paginationHTML = "";
    let maximum = Math.ceil(totalPosts / itemsPerPage);
    let leftnum = Math.floor(pagesToShow / 2);

    paginationHTML += `<span class='totalpages'>Hoja ${currentPage} de ${maximum}</span>`;

    if (currentPage > 1) {
        paginationHTML += createPageLink(currentPage - 1, "Anterior");
    }

    let start = Math.max(currentPage - leftnum, 1);
    let end = Math.min(start + pagesToShow - 1, maximum);

    if (start > 1) paginationHTML += createPageLink(1, "1");
    if (start > 2) paginationHTML += "...";

    for (let r = start; r <= end; r++) {
        paginationHTML += r === currentPage
            ? `<span class="pagenumber current">${r}</span>`
            : createPageLink(r, r);
    }

    if (end < maximum - 1) paginationHTML += "...";
    if (end < maximum) paginationHTML += createPageLink(maximum, maximum);

    if (currentPage < maximum) {
        paginationHTML += createPageLink(currentPage + 1, "Siguiente");
    }

    document.getElementById("blog-pager").innerHTML = paginationHTML;
}

// Función para crear enlaces de paginación
function createPageLink(pageNum, linkText) {
    let url;
    if (type === "search") {
        url = `/search?q=${encodeURIComponent(query)}&max-results=${itemsPerPage}#PageNo=${pageNum}`;
    } else if (type === "label") {
        url = `/search/label/${label}?max-results=${itemsPerPage}#PageNo=${pageNum}`;
    } else {
        url = `#PageNo=${pageNum}`;
    }

    return `<span class="pagenumber"><a href="${url}">${linkText}</a></span>`;
}

// Evento DOM para inicializar la paginación
document.addEventListener("DOMContentLoaded", initPagination);
