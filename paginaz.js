// Parámetros globales
var nopage, type, currentPage, lblname1, searchQuery, itemsPerPage = 12, lastPostDate = null, pagesToShow = 5;

function getSearchQuery() {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("q") || "";
}

function pagination(totalPosts) {
    let paginationHTML = "";
    let leftnum = Math.floor(pagesToShow / 2);

    // Ajuste de pagesToShow si es necesario
    if (leftnum === pagesToShow - leftnum) {
        pagesToShow = 2 * leftnum + 1;
    }

    // Calcular el rango de páginas
    let start = currentPage - leftnum;
    start = Math.max(start, 1); // Garantiza que el inicio no sea menor que 1

    let maximum = Math.floor(totalPosts / itemsPerPage) + 1;
    if (maximum * itemsPerPage === totalPosts) {
        maximum -= 1;
    }

    let end = start + pagesToShow - 1;
    end = Math.min(end, maximum); // Garantiza que el final no sea mayor que el máximo

    paginationHTML += `<span class='totalpages'>Hoja ${currentPage} de ${maximum}</span>`;

    // Enlace a la página anterior
    let previousPage = currentPage > 1 ? createPageLink(currentPage - 1, "Anterior", type) : "";
    paginationHTML += previousPage;

    // Enlace a la página 1
    if (start > 1) {
        paginationHTML += type === "page"
            ? `<span class="pagenumber"><a href="${home_page}">1</a></span>`
            : `<span class="pagenumber"><a href="/search/label/${lblname1}?&max-results=${itemsPerPage}">1</a></span>`;
    }

    if (start > 2) paginationHTML += "...";

    // Generar las páginas intermedias
    for (let r = start; r <= end; r++) {
        if (r === parseInt(currentPage, 10)) {
            paginationHTML += `<span class="pagenumber current">${r}</span>`;
        } else {
            paginationHTML += createPageLink(r, r, type);
        }
    }

    if (end < maximum - 1) paginationHTML += "...";

    // Enlace para la última página
    if (end < maximum) paginationHTML += createPageLink(maximum, maximum, type);

    // Enlace a la siguiente página
    let nextPage = currentPage < maximum ? createPageLink(currentPage + 1, "Siguiente", type) : "";
    paginationHTML += nextPage;

    // Actualizar el área de la página
    let pageArea = document.getElementsByName("pageArea");
    let pagerElement = document.getElementById("blog-pager");

    for (let i = 0; i < pageArea.length; i++) {
        pageArea[i].innerHTML = paginationHTML;
    }

    if (pagerElement) {
        pagerElement.innerHTML = paginationHTML;
    }
}

function createPageLink(pageNum, linkText, type) {
    let updatedMax = lastPostDate || (pageNum === 1 ? null : new Date().toISOString().replace(".000", "").replace("Z", "-05:00"));
    let searchParam = searchQuery ? `q=${encodeURIComponent(searchQuery)}` : "";
    let startIndex = (pageNum - 1) * itemsPerPage;

    if (type === "page") {
        let url = `https://www.yeifer.com/search?${searchParam}` +
                  (pageNum > 1 && updatedMax ? `&updated-max=${encodeURIComponent(updatedMax)}&max-results=${itemsPerPage}&start=${startIndex}&by-date=false` : "");
        return `<span class="pagenumber"><a href="${url}" onclick="redirectpage(${pageNum}); return false;">${linkText}</a></span>`;
    } else {
        let url = `/search/label/${lblname1}` +
                  (pageNum > 1 && updatedMax ? `?updated-max=${encodeURIComponent(updatedMax)}&max-results=${itemsPerPage}&start=${startIndex}&by-date=false` : "");
        return `<span class="pagenumber"><a href="${url}" onclick="redirectlabel(${pageNum}); return false;">${linkText}</a></span>`;
    }
}

function paginationall(data) {
    let totalResults = parseInt(data.feed.openSearch$totalResults.$t, 10);
    
    if (data.feed.entry && data.feed.entry.length > 0) {
        lastPostDate = data.feed.entry[data.feed.entry.length - 1].updated.$t;
    } else if (!lastPostDate) {
        lastPostDate = new Date().toISOString().replace(".000", "").replace("Z", "-05:00");
    }

    pagination(totalResults);
}

function bloggerpage() {
    let activePage = window.location.href;
    searchQuery = getSearchQuery();

    if (activePage.indexOf("/search/label/") !== -1) {
        lblname1 = activePage.includes("?updated-max") 
            ? activePage.substring(activePage.indexOf("/search/label/") + 14, activePage.indexOf("?updated-max"))
            : activePage.substring(activePage.indexOf("/search/label/") + 14, activePage.indexOf("?&max") !== -1 ? activePage.indexOf("?&max") : activePage.length);
        type = "label";
    } else {
        type = "page";
    }

    currentPage = activePage.includes("#PageNo=") 
        ? parseInt(activePage.substring(activePage.indexOf("#PageNo=") + 8), 10) 
        : 1;

    let scriptUrl = type === "page" && !searchQuery
        ? `${home_page}feeds/posts/summary?max-results=${itemsPerPage}&start=${(currentPage - 1) * itemsPerPage}&alt=json-in-script&callback=paginationall`
        : type === "page" && searchQuery
        ? `${home_page}feeds/posts/summary?max-results=${itemsPerPage}&start=${(currentPage - 1) * itemsPerPage}&q=${encodeURIComponent(searchQuery)}&alt=json-in-script&callback=paginationall`
        : `${home_page}feeds/posts/summary/-/${lblname1}?max-results=${itemsPerPage}&start=${(currentPage - 1) * itemsPerPage}&alt=json-in-script&callback=paginationall`;

    let script = document.createElement("script");
    script.src = scriptUrl;
    document.body.appendChild(script);
}

function redirectpage(pageNum) {
    if (pageNum === 1) {
        location.href = searchQuery ? `https://www.yeifer.com/search?q=${encodeURIComponent(searchQuery)}` : home_page;
        return;
    }

    jsonstart = (pageNum - 1) * itemsPerPage;
    nopage = pageNum;

    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = searchQuery 
        ? `${home_page}feeds/posts/summary?start-index=${jsonstart}&max-results=1&q=${encodeURIComponent(searchQuery)}&alt=json-in-script&callback=finddatepost`
        : `${home_page}feeds/posts/summary?start-index=${jsonstart}&max-results=1&alt=json-in-script&callback=finddatepost`;

    document.getElementsByTagName("head")[0].appendChild(script);
}

function redirectlabel(pageNum) {
    jsonstart = (pageNum - 1) * itemsPerPage;
    nopage = pageNum;

    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `${home_page}feeds/posts/summary/-/${lblname1}?start-index=${jsonstart}&max-results=1&alt=json-in-script&callback=finddatepost`;

    document.getElementsByTagName("head")[0].appendChild(script);
}

function finddatepost(data) {
    let post = data.feed.entry[0];
    let dateStr = post.published.$t.substring(0, 19) + post.published.$t.substring(23, 29);
    let encodedDate = encodeURIComponent(dateStr);
    let searchParam = searchQuery ? `q=${encodeURIComponent(searchQuery)}` : "";

    let redirectUrl = type === "page"
        ? `/search?${searchParam}&updated-max=${encodedDate}&max-results=${itemsPerPage}&start=${(nopage - 1) * itemsPerPage}&by-date=false`
        : `/search/label/${lblname1}?updated-max=${encodedDate}&max-results=${itemsPerPage}&start=${(nopage - 1) * itemsPerPage}&by-date=false`;

    location.href = redirectUrl;
}

// Inicialización de la página
var nopage, type, currentPage, lblname1;
bloggerpage();
