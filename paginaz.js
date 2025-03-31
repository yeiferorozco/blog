// Configuración general de paginación
var itemsPerPage = 12;
var pagesToShow = 5;

// Función principal de paginación
function paginationGeneral(totalPosts, type, config) {
    let paginationHTML = "";
    let maximum = Math.ceil(totalPosts / config.itemsPerPage);
    let leftnum = Math.floor(config.pagesToShow / 2);

    paginationHTML += `<span class='totalpages'>Hoja ${config.currentPage} de ${maximum}</span>`;

    if (config.currentPage > 1) {
        paginationHTML += createPageLink(config.currentPage - 1, "Anterior", type, config);
    }

    let start = Math.max(config.currentPage - leftnum, 1);
    let end = Math.min(start + config.pagesToShow - 1, maximum);

    if (start > 1) paginationHTML += createPageLink(1, "1", type, config);
    if (start > 2) paginationHTML += "...";

    for (let r = start; r <= end; r++) {
        paginationHTML += r === config.currentPage
            ? `<span class="pagenumber current">${r}</span>`
            : createPageLink(r, r, type, config);
    }

    if (end < maximum - 1) paginationHTML += "...";
    if (end < maximum) paginationHTML += createPageLink(maximum, maximum, type, config);

    if (config.currentPage < maximum) {
        paginationHTML += createPageLink(config.currentPage + 1, "Siguiente", type, config);
    }

    document.getElementById("blog-pager").innerHTML = paginationHTML;
}

// Función para crear enlaces de paginación
function createPageLink(pageNum, linkText, type, config) {
    let url;
    if (type === "search") {
        url = `/search?q=${config.query}&max-results=${config.itemsPerPage}#PageNo=${pageNum}`;
    } else if (type === "label") {
        url = `/search/label/${config.label}?max-results=${config.itemsPerPage}#PageNo=${pageNum}`;
    } else {
        url = `#PageNo=${pageNum}`;
    }
    return `<span class="pagenumber"><a href="${url}">${linkText}</a></span>`;
}

// Función para inicializar la paginación en diferentes contextos
function bloggerpage() {
    let urlParams = new URLSearchParams(window.location.search);
    let currentPage = window.location.href.includes("#PageNo=") ? parseInt(window.location.href.split("#PageNo=")[1]) : 1;

    let type, label, query;
    if (window.location.href.includes("/search/label/")) {
        type = "label";
        label = urlParams.get("label");
    } else if (urlParams.has("q")) {
        type = "search";
        query = urlParams.get("q");
    } else {
        type = "page";
    }

    let scriptUrl = `${window.location.origin}/feeds/posts/summary?max-results=${itemsPerPage}&start=${(currentPage - 1) * itemsPerPage}&alt=json-in-script&callback=paginationall`;

    let script = document.createElement("script");
    script.src = scriptUrl;
    document.body.appendChild(script);

    return { type, currentPage, label, query, itemsPerPage, pagesToShow };
}

// Función para manejar la respuesta del API de Blogger
function paginationall(data) {
    let totalPosts = parseInt(data.feed.openSearch$totalResults.$t, 10);

    let config = bloggerpage();
    paginationGeneral(totalPosts, config.type, config);
}

document.addEventListener("DOMContentLoaded", bloggerpage);
