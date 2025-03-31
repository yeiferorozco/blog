// Parámetros globales
var nopage, type, currentPage, lblname1, searchQuery, itemsPerPage = 12, lastPostDate;

// Función para obtener el término de búsqueda del usuario
function getSearchQuery() {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("q") || "";
}

// Función principal de paginación
function pagination(totalPosts) {
    let paginationHTML = "";
    let pagesToShow = 5; // Puedes ajustar este valor
    let leftnum = Math.floor(pagesToShow / 2);
    let maximum = Math.ceil(totalPosts / itemsPerPage);

    paginationHTML += `<span class='totalpages'>Hoja ${currentPage} de ${maximum}</span>`;

    if (currentPage > 1) {
        paginationHTML += createPageLink(currentPage - 1, "Anterior", type);
    }

    let start = Math.max(currentPage - leftnum, 1);
    let end = Math.min(start + pagesToShow - 1, maximum);

    if (start > 1) paginationHTML += createPageLink(1, "1", type);
    if (start > 2) paginationHTML += "...";

    for (let r = start; r <= end; r++) {
        paginationHTML += r === currentPage 
            ? `<span class="pagenumber current">${r}</span>` 
            : createPageLink(r, r, type);
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
    let updatedMax = lastPostDate || new Date().toISOString().replace(".000", "").replace("Z", "-05:00");
    let searchParam = searchQuery ? `q=${encodeURIComponent(searchQuery)}` : "";
    let startIndex = (pageNum - 1) * itemsPerPage;
    let url;

    if (type === "page") {
        url = `https://www.yeifer.com/search?${searchParam}` +
              (pageNum > 1 ? `&updated-max=${encodeURIComponent(updatedMax)}&max-results=${itemsPerPage}&start=${startIndex}&by-date=false` : "");
    } else {
        url = `https://www.yeifer.com/search/label/${lblname1}` +
              (pageNum > 1 ? `?updated-max=${encodeURIComponent(updatedMax)}&max-results=${itemsPerPage}&start=${startIndex}&by-date=false` : "");
    }

    return `<span class="pagenumber"><a href="${url}">${linkText}</a></span>`;
}

// Procesa los datos de Blogger y extrae la fecha del último post
function paginationall(data) {
    let totalResults = parseInt(data.feed.openSearch$totalResults.$t, 10);
    
    // Obtener la fecha del último post de la página actual
    if (data.feed.entry && data.feed.entry.length > 0) {
        lastPostDate = data.feed.entry[data.feed.entry.length - 1].updated.$t;
    }

    pagination(totalResults);
}

// Determina el tipo de página y carga información
function bloggerpage() {
    let activePage = window.location.href;
    searchQuery = getSearchQuery();

    if (activePage.includes("/search/label/")) {
        lblname1 = activePage.split("/search/label/")[1].split("?")[0];
        type = "label";
    } else {
        type = "page";
    }

    currentPage = activePage.includes("#PageNo=") ? parseInt(activePage.split("#PageNo=")[1]) : 1;
    
    let scriptUrl = type === "page"
        ? `${home_page}feeds/posts/summary?max-results=${itemsPerPage}&start=${(currentPage - 1) * itemsPerPage}&alt=json-in-script&callback=paginationall`
        : `${home_page}feeds/posts/summary/-/${lblname1}?max-results=${itemsPerPage}&start=${(currentPage - 1) * itemsPerPage}&alt=json-in-script&callback=paginationall`;

    let script = document.createElement("script");
    script.src = scriptUrl;
    document.body.appendChild(script);
}

// Inicialización
document.addEventListener("DOMContentLoaded", bloggerpage);
