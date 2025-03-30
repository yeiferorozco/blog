// Función principal de paginación
function pagination(totalPosts) {
    let paginationHTML = "";
    let leftnum = Math.floor(pagesToShow / 2);

    if (leftnum === pagesToShow - leftnum) {
        pagesToShow = 2 * leftnum + 1;
    }

    let start = currentPage - leftnum;
    start = Math.max(start, 1);

    let maximum = Math.floor(totalPosts / itemsPerPage) + 1;
    if (maximum * itemsPerPage === totalPosts) {
        maximum -= 1;
    }

    let end = start + pagesToShow - 1;
    end = Math.min(end, maximum);

    paginationHTML += `<span class='totalpages'>Hoja ${currentPage} de ${maximum}</span>`;

    let previousPage = currentPage > 1 ? createPageLink(currentPage - 1, prevpage, type) : "";
    paginationHTML += previousPage;

    if (start > 1) {
        paginationHTML += type === "page"
            ? `<span class="pagenumber"><a href="${home_page}">1</a></span>`
            : `<span class="pagenumber"><a href="/search/label/${lblname1}?&max-results=${itemsPerPage}">1</a></span>`;
    }

    if (start > 2) paginationHTML += "...";

    for (let r = start; r <= end; r++) {
        if (r === parseInt(currentPage, 10)) {
            paginationHTML += `<span class="pagenumber current">${r}</span>`;
        } else {
            paginationHTML += createPageLink(r, r, type);
        }
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

// Función para generar enlaces con búsqueda personalizada
function createSearchPageLink(pageNum) {
    let updatedMax = encodeURIComponent(findUpdatedMax(pageNum));
    return `<span class="pagenumber"><a href="/search?q=${searchQuery}&updated-max=${updatedMax}&max-results=${itemsPerPage}&start=${(pageNum - 1) * itemsPerPage}&by-date=false">${pageNum}</a></span>`;
}

// Función para encontrar la fecha de actualización máxima
function findUpdatedMax(pageNum) {
    let jsonstart = (pageNum - 1) * itemsPerPage;
    return jsonstart > 0 ? new Date().toISOString() : "";
}

// Función para redirigir a la búsqueda con paginación
function redirectSearch(pageNum) {
    let updatedMax = encodeURIComponent(findUpdatedMax(pageNum));
    location.href = `/search?q=${searchQuery}&updated-max=${updatedMax}&max-results=${itemsPerPage}&start=${(pageNum - 1) * itemsPerPage}&by-date=false`;
}

// Ajuste en la función bloggerpage para manejar búsquedas
function bloggerpage() {
    let activePage = urlactivepage;

    if (activePage.includes("?q=")) {
        type = "search";
        let queryIndex = activePage.indexOf("?q=") + 3;
        searchQuery = activePage.substring(queryIndex, activePage.indexOf("&") > 0 ? activePage.indexOf("&") : activePage.length);
        itemsPerPage = activePage.includes("&max-results=") ? parseInt(activePage.split("&max-results=")[1]) : 9;
        currentPage = activePage.includes("#PageNo=")
            ? parseInt(activePage.substring(activePage.indexOf("#PageNo=") + 8), 10)
            : 1;

        document.write(`<script src="${home_page}feeds/posts/summary?q=${searchQuery}&alt=json-in-script&callback=paginationall&max-results=1"></script>`);
    } else if (!activePage.includes(".html") && activePage.indexOf("/search/label/") === -1) {
        type = "page";
        currentPage = activePage.includes("#PageNo=")
            ? parseInt(activePage.substring(activePage.indexOf("#PageNo=") + 8), 10)
            : 1;

        document.write(`<script src="${home_page}feeds/posts/summary?max-results=1&alt=json-in-script&callback=paginationall"></script>`);
    } else {
        type = "label";
        itemsPerPage = activePage.includes("&max-results=") ? parseInt(activePage.split("&max-results=")[1]) : 20;
        currentPage = activePage.includes("#PageNo=")
            ? parseInt(activePage.substring(activePage.indexOf("#PageNo=") + 8), 10)
            : 1;

        document.write(`<script src="${home_page}feeds/posts/summary/-/${lblname1}?alt=json-in-script&callback=paginationall&max-results=1"></script>`);
    }
}

var nopage, type, currentPage, lblname1, searchQuery;
bloggerpage();
