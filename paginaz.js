// Parámetros globales
var nopage, type, currentPage, lblname1, searchQuery;
const itemsPerPage = 12;

// Función principal de paginación
function pagination(totalPosts) {
    let paginationHTML = "";
    let leftnum = Math.floor(pagesToShow / 2);
    let maximum = Math.ceil(totalPosts / itemsPerPage);
    let start = Math.max(currentPage - leftnum, 1);
    let end = Math.min(start + pagesToShow - 1, maximum);

    paginationHTML += `<span class='totalpages'>Hoja ${currentPage} de ${maximum}</span>`;
    if (currentPage > 1) paginationHTML += createPageLink(currentPage - 1, "Anterior");
    if (start > 1) paginationHTML += createPageLink(1, "1");
    if (start > 2) paginationHTML += "...";
    
    for (let r = start; r <= end; r++) {
        paginationHTML += r === currentPage ? `<span class="pagenumber current">${r}</span>` : createPageLink(r, r);
    }
    
    if (end < maximum - 1) paginationHTML += "...";
    if (end < maximum) paginationHTML += createPageLink(maximum, maximum);
    if (currentPage < maximum) paginationHTML += createPageLink(currentPage + 1, "Siguiente");
    
    document.getElementById("blog-pager").innerHTML = paginationHTML;
}

// Genera enlaces de paginación con fecha actualizada
function createPageLink(pageNum, linkText) {
    let updatedMax = getUpdatedMax();
    let url = type === "page" 
        ? `/search?q=${encodeURIComponent(searchQuery)}&updated-max=${updatedMax}&max-results=${itemsPerPage}#PageNo=${pageNum}`
        : `/search/label/${lblname1}?updated-max=${updatedMax}&max-results=${itemsPerPage}#PageNo=${pageNum}`;
    return `<span class="pagenumber"><a href="${url}">${linkText}</a></span>`;
}

// Obtiene la fecha del último post en formato correcto
function getUpdatedMax() {
    let date = new Date();
    return encodeURIComponent(date.toISOString().replace(".000", "").replace("Z", "-05:00"));
}

// Procesa los datos de Blogger
function paginationall(data) {
    let totalResults = parseInt(data.feed.openSearch$totalResults.$t, 10);
    pagination(totalResults);
}

// Determina el tipo de página y carga información
function bloggerpage() {
    let activePage = window.location.href;
    let urlParams = new URLSearchParams(window.location.search);
    searchQuery = urlParams.get("q") || "";
    
    if (activePage.includes("/search/label/")) {
        lblname1 = activePage.split("/search/label/")[1].split("?")[0];
        type = "label";
    } else {
        type = "page";
    }
    
    currentPage = activePage.includes("#PageNo=") ? parseInt(activePage.split("#PageNo=")[1]) : 1;
    let scriptUrl = type === "page" 
        ? `${home_page}feeds/posts/summary?max-results=1&alt=json-in-script&callback=paginationall`
        : `${home_page}feeds/posts/summary/-/${lblname1}?alt=json-in-script&callback=paginationall&max-results=1`;
    
    let script = document.createElement("script");
    script.src = scriptUrl;
    document.body.appendChild(script);
}

// Inicialización
document.addEventListener("DOMContentLoaded", bloggerpage);
