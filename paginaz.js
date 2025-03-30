// Función para obtener el parámetro 'q' de la URL actual
function getSearchQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("q") || "";
}

// Función para redirigir a la página seleccionada con la fecha del último post
function redirectSearchPage(pageNum) {
    let searchQuery = getSearchQuery(); // Obtener el término de búsqueda real
    if (!searchQuery) return; // Evita errores si no hay búsqueda activa

    jsonstart = (pageNum - 1) * itemsPerPage;
    nopage = pageNum;

    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `${home_page}feeds/posts/summary?q=${encodeURIComponent(searchQuery)}&start-index=${jsonstart}&max-results=1&alt=json-in-script&callback=findSearchDatePost`;

    document.getElementsByTagName("head")[0].appendChild(script);
}

// Función para obtener la fecha del último post y generar la URL correcta
function findSearchDatePost(data) {
    let post = data.feed.entry[0];
    let dateStr = post.published.$t.substring(0, 19) + post.published.$t.substring(23, 29);
    let encodedDate = encodeURIComponent(dateStr);
    let searchQuery = getSearchQuery();

    let redirectUrl = `/search?q=${encodeURIComponent(searchQuery)}&updated-max=${encodedDate}&max-results=${itemsPerPage}#PageNo=${nopage}`;
    location.href = redirectUrl;
}

// Ajustar los enlaces de paginación para búsquedas
document.addEventListener("DOMContentLoaded", function () {
    let searchQuery = getSearchQuery();
    if (searchQuery) {
        let paginationLinks = document.querySelectorAll(".pagenumber a");
        paginationLinks.forEach(link => {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                let pageNum = parseInt(this.textContent, 10);
                redirectSearchPage(pageNum);
            });
        });
    }
});
