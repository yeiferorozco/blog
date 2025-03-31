// Función para obtener el parámetro 'q' de la URL actual
 function getSearchQuery() {
     const urlParams = new URLSearchParams(window.location.search);
     return urlParams.get("q") || "";
 // Parámetros globales
 var nopage, type, currentPage, lblname1, searchQuery;
 
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
 
 // Genera enlaces de paginación con fecha actualizada
 function createPageLink(pageNum, linkText, type) {
     let updatedMax = getUpdatedMax();
     let url = type === "page" 
         ? `/search?q=${encodeURIComponent(searchQuery)}&updated-max=${updatedMax}&max-results=${itemsPerPage}#PageNo=${pageNum}`
         : `/search/label/${lblname1}?updated-max=${updatedMax}&max-results=${itemsPerPage}#PageNo=${pageNum}`;
     return `<span class="pagenumber"><a href="${url}">${linkText}</a></span>`;
 }
 
 // Función para redirigir a la página seleccionada con la fecha del último post
 function redirectSearchPage(pageNum) {
     let searchQuery = getSearchQuery(); // Obtener el término de búsqueda real
     if (!searchQuery) return; // Evita errores si no hay búsqueda activa
 // Obtiene la fecha del último post en formato correcto
 function getUpdatedMax() {
     let date = new Date();
     return encodeURIComponent(date.toISOString().replace(".000", "").replace("Z", "-05:00"));
 }
 
     jsonstart = (pageNum - 1) * itemsPerPage;
     nopage = pageNum;
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
     script.type = "text/javascript";
     script.src = `${home_page}feeds/posts/summary?q=${encodeURIComponent(searchQuery)}&start-index=${jsonstart}&max-results=1&alt=json-in-script&callback=findSearchDatePost`;
 
     document.getElementsByTagName("head")[0].appendChild(script);
     script.src = scriptUrl;
     document.body.appendChild(script);
 }
 
 // Función para obtener la fecha del último post y generar la URL correcta
 function findSearchDatePost(data) {
     let post = data.feed.entry[0];
     let dateStr = post.published.$t.substring(0, 19) + post.published.$t.substring(23, 29);
     let encodedDate = encodeURIComponent(dateStr);
     let searchQuery = getSearchQuery();
 // Redirigir a una página específica con fecha actualizada
 function redirectpage(pageNum) {
     let updatedMax = getUpdatedMax();
     location.href = `/search?q=${encodeURIComponent(searchQuery)}&updated-max=${updatedMax}&max-results=${itemsPerPage}#PageNo=${pageNum}`;
 }
 
     let redirectUrl = `/search?q=${encodeURIComponent(searchQuery)}&updated-max=${encodedDate}&max-results=${itemsPerPage}#PageNo=${nopage}`;
     location.href = redirectUrl;
 // Redirigir a una etiqueta específica con fecha actualizada
 function redirectlabel(pageNum) {
     let updatedMax = getUpdatedMax();
     location.href = `/search/label/${lblname1}?updated-max=${updatedMax}&max-results=${itemsPerPage}#PageNo=${pageNum}`;
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
 // Inicialización
 document.addEventListener("DOMContentLoaded", bloggerpage);
