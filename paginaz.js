// Parámetros globales
var nopage, type, currentPage, lblname1, lastPostDate;

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

// Genera enlaces de paginación con la fecha correcta
function createPageLink(pageNum, linkText, type) {
    let updatedMax = lastPostDate ? encodeURIComponent(lastPostDate) : getUpdatedMax();
    let queryParam = new URLSearchParams(window.location.search).get("q") || ""; // Obtiene la búsqueda actual
    let url = type === "page" 
        ? `/search?q=${queryParam}&updated-max=${updatedMax}&max-results=${itemsPerPage}#PageNo=${pageNum}`
        : `/search/label/${lblname1}?updated-max=${updatedMax}&max-results=${itemsPerPage}#PageNo=${pageNum}`;
    return `<span class="pagenumber"><a href="${url}">${linkText}</a></span>`;
}

// Obtiene la fecha del último post en formato correcto
function finddatepost(data) {
    let post = data.feed.entry[0];
    lastPostDate = post.published.$t.substring(0, 19) + post.published.$t.substring(23, 29); // Guarda la fecha para la siguiente página
    paginationall(data);
}

// Procesa los datos de Blogger
function paginationall(data) {
    let totalResults = parseInt(data.feed.openSearch$totalResults.$t, 10);
    pagination(totalResults);
}

// Determina el tipo de página y carga información
function bloggerpage() {
    let activePage = window.location.href;
    if (activePage.includes("/search/label/")) {
        lblname1 = activePage.split("/search/label/")[1].split("?")[0];
        type = "label";
    } else {
        type = "page";
    }
    
    currentPage = activePage.includes("#PageNo=") ? parseInt(activePage.split("#PageNo=")[1]) : 1;
    
    let scriptUrl = type === "page" 
        ? `${home_page}feeds/posts/summary?max-results=${itemsPerPage}&alt=json-in-script&callback=finddatepost`
        : `${home_page}feeds/posts/summary/-/${lblname1}?alt=json-in-script&callback=finddatepost&max-results=${itemsPerPage}`;
    
    let script = document.createElement("script");
    script.src = scriptUrl;
    document.body.appendChild(script);
}

// Redirigir a una página específica con la fecha correcta
function redirectpage(pageNum) {
    let updatedMax = lastPostDate ? encodeURIComponent(lastPostDate) : getUpdatedMax();
    let queryParam = new URLSearchParams(window.location.search).get("q") || ""; // Obtiene la búsqueda actual
    location.href = `/search?q=${queryParam}&updated-max=${updatedMax}&max-results=${itemsPerPage}#PageNo=${pageNum}`;
}

// Inicialización
document.addEventListener("DOMContentLoaded", bloggerpage);
