/*
 * Detector adblock para Blogger - Creado por Yeifer Orozco
 * Copyright © 2025 Yeifer Orozco
 * 
 * Licencia MIT
 */

    // Función para mostrar instrucciones
    function showInstructions(blocker) {
      document.querySelectorAll('.instructions').forEach(el => el.style.display = 'none');
      document.getElementById(blocker + '-instructions').style.display = 'block';
    }

    // Función para detectar el bloqueador
    function detectAdBlock() {
      var adBlockDetected = false;
      var adIds = ['ad', 'ads', 'adsense', 'advert_125x125', 'advert_sky', 'article_ad_container'];
      var testDiv = document.createElement('div');
      adIds.forEach(function(id) {
        testDiv.setAttribute('id', id);
        testDiv.className = 'ads banner ad advertisement';
        testDiv.style.display = 'block';
        testDiv.style.width = '1px';
        testDiv.style.height = '1px';
        testDiv.style.position = 'absolute';
        testDiv.style.left = '-9999px';
        document.body.appendChild(testDiv);
        if (window.getComputedStyle(testDiv).display === 'none' || testDiv.offsetHeight === 0 || testDiv.offsetWidth === 0) {
          adBlockDetected = true;
        }
        document.body.removeChild(testDiv);
      });
      return adBlockDetected;
    }

    // Función para cerrar el modal
    function closeModal() {
      var modal = document.getElementById('adblockModal');
      modal.classList.remove('visible');
      // Verificar de nuevo y sugerir recarga
      setTimeout(function() {
        if (detectAdBlock()) {
          alert('Por favor, recarga la página (presiona F5 o el botón de recargar) para confirmar que el bloqueador está desactivado.');
        }
      }, 500);
    }

    // Función para permitir navegación sin desactivar
    function bypassAdblock() {
      var modal = document.getElementById('adblockModal');
      modal.classList.remove('visible');
      // Guardar en sessionStorage que el usuario eligió navegar sin desactivar
      sessionStorage.setItem('adblockBypass', 'true');
    }

    // Detección inicial
    window.onload = function () {
      var modal = document.getElementById('adblockModal');
      // Verificar si el usuario ya eligió navegar sin desactivar en esta sesión
      var bypass = sessionStorage.getItem('adblockBypass');
      setTimeout(function() {
        if (detectAdBlock() && bypass !== 'true') {
          modal.classList.add('visible');
        } else {
          modal.classList.remove('visible');
        }
      }, 2000); // Retraso de 2 segundos para mayor precisión
    };
