// Variables globales
var nopage, type, currentPage, lblname1, searchQuery, lastPostDate;

// Función principal de paginación
function pagination(totalPosts) {
    let paginationHTML = "";
    let leftnum = Math.floor(pagesToShow / 2);
    let maximum = Math.ceil(totalPosts / itemsPerPage);

    if (maximum * itemsPerPage === totalPosts) {
        maximum -= 1;
    }

    let start = Math.max(currentPage - leftnum, 1);
    let end = Math.min(start + pagesToShow - 1, maximum);

    paginationHTML += `<span class='totalpages'>Hoja ${currentPage} de ${maximum}</span>`;
    paginationHTML += currentPage > 1 ? createPageLink(currentPage - 1, prevpage, type) : "";

    if (start > 1) {
        paginationHTML += createPageLink(1, "1", type);
        if (start > 2) paginationHTML += "...";
    }

    for (let r = start; r <= end; r++) {
        paginationHTML += r === currentPage 
            ? `<span class="pagenumber current">${r}</span>`
            : createPageLink(r, r, type);
    }

    if (end < maximum - 1) paginationHTML += "...";
    if (end < maximum) paginationHTML += createPageLink(maximum, maximum, type);
    paginationHTML += currentPage < maximum ? createPageLink(currentPage + 1, nextpage, type) : "";

    document.querySelectorAll("[name='pageArea']").forEach(el => el.innerHTML = paginationHTML);
    let pagerElement = document.getElementById("blog-pager");
    if (pagerElement) pagerElement.innerHTML = paginationHTML;
}

// Función para generar enlaces de paginación
function createPageLink(pageNum, linkText, type) {
    let url = type === "page" 
        ? `#PageNo=${pageNum}` 
        : `/search/label/${lblname1}?&max-results=${itemsPerPage}#PageNo=${pageNum}`;
    return `<span class="pagenumber"><a href="${url}">${linkText}</a></span>`;
}

// Obtener parámetros de búsqueda
function getSearchQuery() {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("q") || "";
}

// Manejo de paginación para todas las entradas
function paginationall(data) {
    let totalResults = parseInt(data.feed.openSearch$totalResults.$t, 10);
    if (data.feed.entry && data.feed.entry.length > 0) {
        lastPostDate = data.feed.entry[data.feed.entry.length - 1].updated.$t;
    } else if (!lastPostDate) {
        lastPostDate = new Date().toISOString();
    }
    pagination(totalResults);
}

// Configuración inicial de la página
function bloggerpage() {
    searchQuery = getSearchQuery();
    currentPage = window.location.href.includes("#PageNo=") 
        ? parseInt(window.location.href.split("#PageNo=")[1]) 
        : 1;

    let scriptUrl = `${home_page}feeds/posts/summary?max-results=${itemsPerPage}&start=${(currentPage - 1) * itemsPerPage}&alt=json-in-script&callback=paginationall`;
    let script = document.createElement("script");
    script.src = scriptUrl;
    document.body.appendChild(script);
}

document.addEventListener("DOMContentLoaded", bloggerpage);

// Redirigir a una página específica
function redirectpage(pageNum) {
    if (pageNum === 1) {
        location.href = home_page;
        return;
    }
    jsonstart = (pageNum - 1) * itemsPerPage;
    let script = document.createElement("script");
    script.src = `${home_page}feeds/posts/summary?start-index=${jsonstart}&max-results=1&alt=json-in-script&callback=finddatepost`;
    document.head.appendChild(script);
}

// Redirigir a una etiqueta específica
function redirectlabel(pageNum) {
    jsonstart = (pageNum - 1) * itemsPerPage;
    let script = document.createElement("script");
    script.src = `${home_page}feeds/posts/summary/-/${lblname1}?start-index=${jsonstart}&max-results=1&alt=json-in-script&callback=finddatepost`;
    document.head.appendChild(script);
}

// Manejar la redirección con fecha
function finddatepost(data) {
    let post = data.feed.entry[0];
    let encodedDate = encodeURIComponent(post.published.$t);
    let redirectUrl = type === "page"
        ? `/search?updated-max=${encodedDate}&max-results=${itemsPerPage}#PageNo=${nopage}`
        : `/search/label/${lblname1}?updated-max=${encodedDate}&max-results=${itemsPerPage}#PageNo=${nopage}`;
    location.href = redirectUrl;
}

// Agregar max-results a los enlaces de etiquetas
window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('a[href*="/search/label/"]').forEach(link => {
        if (!link.href.includes("?&max-results=")) {
            link.href += "?&max-results=12";
        }
    });
});
