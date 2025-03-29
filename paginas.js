// Función principal de paginación
function pagination(totalPosts) {
    let paginationHTML = "";
    let leftnum = Math.floor(pagesToShow / 2);

    if (leftnum === pagesToShow - leftnum) {
        pagesToShow = 2 * leftnum + 1;
    }

    let start = currentPage - leftnum;
    start = Math.max(start, 1);
    
    let maximum = Math.ceil(totalPosts / itemsPerPage);

    let end = start + pagesToShow - 1;
    end = Math.min(end, maximum);

    paginationHTML += `<span class='totalpages'>Hoja ${currentPage} de ${maximum}</span>`;

    let previousPage = currentPage > 1 ? createPageLink(currentPage - 1, prevpage, type) : "";
    paginationHTML += previousPage;

    if (start > 1) {
        paginationHTML += createPageLink(1, "1", type);
    }

    if (start > 2) paginationHTML += "...";

    for (let r = start; r <= end; r++) {
        paginationHTML += r === parseInt(currentPage, 10) 
            ? `<span class="pagenumber current">${r}</span>` 
            : createPageLink(r, r, type);
    }

    if (end < maximum - 1) paginationHTML += "...";

    if (end < maximum) paginationHTML += createPageLink(maximum, maximum, type);

    let nextPage = currentPage < maximum ? createPageLink(currentPage + 1, nextpage, type) : "";
    paginationHTML += nextPage;

    let pageArea = document.getElementsByName("pageArea");
    let pagerElement = document.getElementById("blog-pager");

    for (let i = 0; i < pageArea.length; i++) {
        pageArea[i].innerHTML = paginationHTML;
    }

    if (pagerElement) {
        pagerElement.innerHTML = paginationHTML;
    }
}

// Genera un enlace de paginación
function createPageLink(pageNum, linkText, type) {
    let query = type === "search" ? `?q=${searchQuery}&max-results=${itemsPerPage}#PageNo=${pageNum}` 
                : type === "page" ? `#PageNo=${pageNum}` 
                : `/search/label/${lblname1}?updated-max=${encodedDate}&max-results=${itemsPerPage}#PageNo=${pageNum}`;
    
    return `<span class="pagenumber"><a href="${query}">${linkText}</a></span>`;
}

// Carga la paginación basada en el total de resultados
function paginationall(data) {
    let totalResults = parseInt(data.feed.openSearch$totalResults.$t, 10);
    pagination(totalResults);
}

// Identifica el tipo de página y configura la paginación
function bloggerpage() {
    let activePage = urlactivepage;
    
    if (activePage.includes("?q=")) {
        type = "search";
        searchQuery = activePage.split("?q=")[1].split("&")[0];
        itemsPerPage = 9;
        currentPage = activePage.includes("#PageNo=") 
            ? parseInt(activePage.split("#PageNo=")[1], 10) 
            : 1;
        
        document.write(`<script src="${home_page}feeds/posts/summary?q=${searchQuery}&alt=json-in-script&callback=paginationall&max-results=1"></script>`);
    } else if (activePage.includes("/search/label/")) {
        type = "label";
        lblname1 = activePage.split("/search/label/")[1].split("?")[0];
        itemsPerPage = 9;
        currentPage = activePage.includes("#PageNo=") 
            ? parseInt(activePage.split("#PageNo=")[1], 10) 
            : 1;

        document.write(`<script src="${home_page}feeds/posts/summary/-/${lblname1}?alt=json-in-script&callback=paginationall&max-results=1"></script>`);
    } else {
        type = "page";
        currentPage = activePage.includes("#PageNo=") 
            ? parseInt(activePage.split("#PageNo=")[1], 10) 
            : 1;

        document.write(`<script src="${home_page}feeds/posts/summary?max-results=1&alt=json-in-script&callback=paginationall"></script>`);
    }
}

// Redirección de paginación
function redirectpage(pageNum) {
    let query = `?max-results=${itemsPerPage}#PageNo=${pageNum}`;
    location.href = home_page + query;
}

function redirectlabel(pageNum) {
    let query = `/search/label/${lblname1}?max-results=${itemsPerPage}#PageNo=${pageNum}`;
    location.href = home_page + query;
}

// Inicializa la función
var nopage, type, currentPage, lblname1, searchQuery;
bloggerpage();
