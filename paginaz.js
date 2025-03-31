// Configuración de paginación
const itemsPerPage = 12;
let currentPage = 1;
let type = "page";
let lblname1 = "";
let home_page = window.location.origin + "/";
let jsonstart = 0;
let nopage = 1;

// Función para generar la paginación
function pagination(totalPosts) {
    let pagesToShow = 5;
    let paginationHTML = "";
    let leftnum = Math.floor(pagesToShow / 2);
    let maximum = Math.ceil(totalPosts / itemsPerPage);
    let start = Math.max(currentPage - leftnum, 1);
    let end = Math.min(start + pagesToShow - 1, maximum);
    
    paginationHTML += `<span class='totalpages'>Hoja ${currentPage} de ${maximum}</span>`;

    if (currentPage > 1) paginationHTML += createPageLink(currentPage - 1, "«", type);
    if (start > 1) paginationHTML += createPageLink(1, "1", type);
    if (start > 2) paginationHTML += "...";
    
    for (let r = start; r <= end; r++) {
        paginationHTML += (r === currentPage) 
            ? `<span class='pagenumber current'>${r}</span>` 
            : createPageLink(r, r, type);
    }
    
    if (end < maximum - 1) paginationHTML += "...";
    if (end < maximum) paginationHTML += createPageLink(maximum, maximum, type);
    if (currentPage < maximum) paginationHTML += createPageLink(currentPage + 1, "»", type);
    
    document.getElementById("blog-pager").innerHTML = paginationHTML;
}

// Función para generar enlaces de página con fecha de actualización
function createPageLink(pageNum, text, type) {
    jsonstart = (pageNum - 1) * itemsPerPage;
    nopage = pageNum;
    let script = document.createElement("script");
    script.src = type === "page" 
        ? `${home_page}feeds/posts/summary?start-index=${jsonstart}&max-results=1&alt=json-in-script&callback=finddatepost`
        : `${home_page}feeds/posts/summary/-/${lblname1}?start-index=${jsonstart}&max-results=1&alt=json-in-script&callback=finddatepost`;
    document.head.appendChild(script);
    return `<span class='pagenumber'><a href='#' onclick='return false;'>${text}</a></span>`;
}

// Manejo de datos de paginación
function paginationall(data) {
    let totalResults = parseInt(data.feed.openSearch$totalResults.$t, 10);
    pagination(totalResults);
}

// Identificación del tipo de página
function bloggerpage() {
    let activePage = window.location.href;
    
    if (activePage.includes("/search/label/")) {
        let match = activePage.match(/\/search\/label\/([^?&]+)/);
        lblname1 = match ? match[1] : "";
        type = "label";
    }
    
    let pageMatch = activePage.match(/#PageNo=(\d+)/);
    currentPage = pageMatch ? parseInt(pageMatch[1], 10) : 1;
    
    let script = document.createElement("script");
    script.src = type === "page" 
        ? `${home_page}feeds/posts/summary?max-results=1&alt=json-in-script&callback=paginationall`
        : `${home_page}feeds/posts/summary/-/${lblname1}?max-results=1&alt=json-in-script&callback=paginationall`;
    document.head.appendChild(script);
}

// Función para obtener la fecha del último post y redirigir correctamente
function finddatepost(data) {
    let post = data.feed.entry[0];
    let dateStr = post.published.$t.substring(0, 19) + post.published.$t.substring(23, 29);
    let encodedDate = encodeURIComponent(dateStr);

    let redirectUrl = type === "page"
        ? `${home_page}search?updated-max=${encodedDate}&max-results=${itemsPerPage}#PageNo=${nopage}`
        : `${home_page}search/label/${lblname1}?updated-max=${encodedDate}&max-results=${itemsPerPage}#PageNo=${nopage}`;

    location.href = redirectUrl;
}

// Iniciar paginación
document.addEventListener("DOMContentLoaded", bloggerpage);
