// Parámetros generales
var itemsPerPage = 12; 
var pagesToShow = 5;

// Función para inicializar y detectar tipo de contexto
function bloggerpage() {
    let urlParams = new URLSearchParams(window.location.search);
    let currentPage = window.location.href.includes("#PageNo=") ? parseInt(window.location.href.split("#PageNo=")[1]) : 1;

    let type = "page";
    let label = null;
    let query = null;

    if (window.location.href.includes("/search/label/")) {
        type = "label";
        label = decodeURIComponent(window.location.href.split("/search/label/")[1].split("?")[0]);
    } else if (urlParams.has("q")) {
        type = "search";
        query = urlParams.get("q");
    }

    let config = {
        type: type,
        currentPage: currentPage,
        label: label,
        query: query,
        itemsPerPage: itemsPerPage,
        pagesToShow: pagesToShow
    };

    let scriptUrl = `${window.location.origin}/feeds/posts/summary?max-results=${itemsPerPage}&start-index=${(currentPage - 1) * itemsPerPage + 1}&alt=json-in-script&callback=paginationall`;

    let script = document.createElement("script");
    script.src = scriptUrl;
    document.body.appendChild(script);

    return config;
}

// Función para manejar la respuesta de Blogger y paginar
function paginationall(data) {
    let totalPosts = parseInt(data.feed.openSearch$totalResults.$t, 10);

    // Configuración de tipo actual
    let config = bloggerpage();
    paginationGeneral(totalPosts, config);
}

// Función principal de paginación
function paginationGeneral(totalPosts, config) {
    let paginationHTML = "";
    let maximum = Math.ceil(totalPosts / config.itemsPerPage);
    let leftnum = Math.floor(config.pagesToShow / 2);

    paginationHTML += `<span class='totalpages'>Hoja ${config.currentPage} de ${maximum}</span>`;

    if (config.currentPage > 1) {
        paginationHTML += createPageLink(config.currentPage - 1, "Anterior", config);
    }

    let start = Math.max(config.currentPage - leftnum, 1);
    let end = Math.min(start + config.pagesToShow - 1, maximum);

    if (start > 1) paginationHTML += createPageLink(1, "1", config);
    if (start > 2) paginationHTML += "...";

    for (let r = start; r <= end; r++) {
        paginationHTML += r === config.currentPage
            ? `<span class="pagenumber current">${r}</span>`
            : createPageLink(r, r, config);
    }

    if (end < maximum - 1) paginationHTML += "...";
    if (end < maximum) paginationHTML += createPageLink(maximum, maximum, config);

    if (config.currentPage < maximum) {
        paginationHTML += createPageLink(config.currentPage + 1, "Siguiente", config);
    }

    document.getElementById("blog-pager").innerHTML = paginationHTML;
}

// Función para crear enlaces correctamente
function createPageLink(pageNum, linkText, config) {
    let url = "#";
    if (config.type === "search") {
        url = `/search?q=${encodeURIComponent(config.query)}&max-results=${config.itemsPerPage}#PageNo=${pageNum}`;
    } else if (config.type === "label") {
        url = `/search/label/${config.label}?max-results=${config.itemsPerPage}#PageNo=${pageNum}`;
    } else {
        url = `#PageNo=${pageNum}`;
    }

    return `<span class="pagenumber"><a href="${url}">${linkText}</a></span>`;
}

document.addEventListener("DOMContentLoaded", bloggerpage);
