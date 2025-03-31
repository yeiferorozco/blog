document.addEventListener("DOMContentLoaded", function () {
    let currentURL = window.location.href;

    if (currentURL.includes("search?q=")) {
        // Código para la paginación en búsquedas
        console.log("Ejecutando paginación en búsqueda...");
        bloggerpage();
    } else {
        // Código que se ejecuta en todas las demás páginas
        console.log("Ejecutando código general...");
        ejecutarCodigoGeneral();
    }
});

// 🔵 Código de paginación en búsquedas
var currentPage, searchQuery, itemsPerPage = 12, lastPostDate = null;

function getSearchQuery() {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("q") || "";
}

function pagination(totalPosts) {
    let paginationHTML = "";
    let pagesToShow = 5;
    let leftnum = Math.floor(pagesToShow / 2);
    let maximum = Math.ceil(totalPosts / itemsPerPage);

    paginationHTML += `<span class='totalpages'>Hoja ${currentPage} de ${maximum}</span>`;

    if (currentPage > 1) {
        paginationHTML += createPageLink(currentPage - 1, "Anterior");
    }

    let start = Math.max(currentPage - leftnum, 1);
    let end = Math.min(start + pagesToShow - 1, maximum);

    if (start > 1) paginationHTML += createPageLink(1, "1");
    if (start > 2) paginationHTML += "...";

    for (let r = start; r <= end; r++) {
        paginationHTML += r === currentPage 
            ? `<span class="pagenumber current">${r}</span>` 
            : createPageLink(r, r);
    }

    if (end < maximum - 1) paginationHTML += "...";
    if (end < maximum) paginationHTML += createPageLink(maximum, maximum);

    if (currentPage < maximum) {
        paginationHTML += createPageLink(currentPage + 1, "Siguiente");
    }

    document.getElementById("blog-pager").innerHTML = paginationHTML;
}

function createPageLink(pageNum, linkText) {
    let updatedMax = lastPostDate || (pageNum === 1 ? null : new Date().toISOString().replace(".000", "").replace("Z", "-05:00"));
    let searchParam = searchQuery ? `q=${encodeURIComponent(searchQuery)}` : "";
    let startIndex = (pageNum - 1) * itemsPerPage;
    let url = `https://www.yeifer.com/search?${searchParam}` +
              (pageNum > 1 && updatedMax ? `&updated-max=${encodeURIComponent(updatedMax)}&max-results=${itemsPerPage}&start=${startIndex}&by-date=false` : "");

    return `<span class="pagenumber"><a href="${url}">${linkText}</a></span>`;
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
    searchQuery = getSearchQuery();
    currentPage = window.location.href.includes("#PageNo=") ? parseInt(window.location.href.split("#PageNo=")[1]) : 1;
    
    let scriptUrl = `${home_page}feeds/posts/summary?max-results=${itemsPerPage}&start=${(currentPage - 1) * itemsPerPage}&alt=json-in-script&callback=paginationall`;
    
    let script = document.createElement("script");
    script.src = scriptUrl;
    document.body.appendChild(script);
}

// 🔴 Código general (para todo menos páginas de búsqueda)
function ejecutarCodigoGeneral() {
    console.log("Aquí va el código para las demás páginas.");
    // Agrega aquí cualquier otro código que no deba ejecutarse en páginas de búsqueda.
    // Función principal de paginación
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
    let previousPage = currentPage > 1 ? createPageLink(currentPage - 1, prevpage, type) : "";
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
    let nextPage = currentPage < maximum ? createPageLink(currentPage + 1, nextpage, type) : "";
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

// Función para generar un enlace de página
function createPageLink(pageNum, linkText, type) {
    if (type === "page") {
        return `<span class="pagenumber"><a href="#" onclick="redirectpage(${pageNum}); return false;">${linkText}</a></span>`;
    } else {
        return `<span class="pagenumber"><a href="#" onclick="redirectlabel(${pageNum}); return false;">${linkText}</a></span>`;
    }
}

// Función para manejar la paginación de todas las entradas
function paginationall(data) {
    let totalResults = parseInt(data.feed.openSearch$totalResults.$t, 10);
    pagination(totalResults);
}

// Función para determinar el tipo de página y cargar la información
function bloggerpage() {
    let activePage = urlactivepage;
    
    if (activePage.indexOf("/search/label/") !== -1) {
        lblname1 = activePage.includes("?updated-max") 
            ? activePage.substring(activePage.indexOf("/search/label/") + 14, activePage.indexOf("?updated-max"))
            : activePage.substring(activePage.indexOf("/search/label/") + 14, activePage.indexOf("?&max"));
    }

    if (!activePage.includes("?q=") && !activePage.includes(".html") && activePage.indexOf("/search/label/") === -1) {
        type = "page";
        currentPage = activePage.includes("#PageNo=") 
    ? parseInt(activePage.substring(activePage.indexOf("#PageNo=") + 8), 10) 
    : 1;

        document.write(`<script src="${home_page}feeds/posts/summary?max-results=1&alt=json-in-script&callback=paginationall"></script>`);
    } else {
        type = "label";
        if (!activePage.includes("&max-results=")) {
            itemsPerPage = 12;
        }
        currentPage = activePage.includes("#PageNo=") 
    ? parseInt(activePage.substring(activePage.indexOf("#PageNo=") + 8), 10) 
    : 1;

        document.write(`<script src="${home_page}feeds/posts/summary/-/${lblname1}?alt=json-in-script&callback=paginationall&max-results=1"></script>`);
    }
}

// Función para redirigir a la página seleccionada
function redirectpage(pageNum) {
    // Si la página es 1, redirige directamente a la página de inicio
    if (pageNum === 1) {
        location.href = home_page; // Redirige a la página de inicio
        return;
    }

    // Para otras páginas, calcula el inicio y redirige
    jsonstart = (pageNum - 1) * itemsPerPage;
    nopage = pageNum;

    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `${home_page}feeds/posts/summary?start-index=${jsonstart}&max-results=1&alt=json-in-script&callback=finddatepost`;

    document.getElementsByTagName("head")[0].appendChild(script);
}

// Función para redirigir a una etiqueta
function redirectlabel(pageNum) {
    jsonstart = (pageNum - 1) * itemsPerPage;
    nopage = pageNum;

    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `${home_page}feeds/posts/summary/-/${lblname1}?start-index=${jsonstart}&max-results=1&alt=json-in-script&callback=finddatepost`;

    document.getElementsByTagName("head")[0].appendChild(script);
}

// Función para manejar la redirección con fecha
function finddatepost(data) {
    let post = data.feed.entry[0];
    let dateStr = post.published.$t.substring(0, 19) + post.published.$t.substring(23, 29);
    let encodedDate = encodeURIComponent(dateStr);

    let redirectUrl = type === "page"
        ? `/search?updated-max=${encodedDate}&max-results=${itemsPerPage}#PageNo=${nopage}`
        : `/search/label/${lblname1}?updated-max=${encodedDate}&max-results=${itemsPerPage}#PageNo=${nopage}`;

    location.href = redirectUrl;
}

// Inicialización de la página
var nopage, type, currentPage, lblname1;
bloggerpage();

// Etiquetas LB página
document.addEventListener("DOMContentLoaded", function () {
    let labelLinks = document.querySelectorAll('a[href*="/search/label/"]');

    labelLinks.forEach(function (link) {
        if (!link.href.includes("?&max-results=")) {
            link.href += "?&max-results=12";
        }
    });
});
}
