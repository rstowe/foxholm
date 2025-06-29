export default {
  // Privacy banner
  privacy: {
    noSignups: "Sin registro",
    noImageStorage: "No almacenamos tus imágenes",
    noCookies: "Sin cookies"
  },
  
  // Footer
  footer: {
    copyright: "© 2025 Foxholm. Estudio profesional de IA de imágenes.",
    loading: "Cargando...",
    error: "Error al cargar la página"
  },
  
  // Common
  common: {
    separator: "|",
    loading: "Cargando Foxholm Studio...",
    error: {
      configLoad: "Error al cargar la configuración de la herramienta. Por favor, inténtalo de nuevo más tarde.",
      noImage: "Por favor, sube una imagen primero",
      subdomain: "No se pudo determinar el subdominio de la URL",
      processing: "Error en el procesamiento",
      processImage: "Error al procesar la imagen"
    },
    success: {
      resultReady: "¡Tu resultado mejorado está listo!"
    },
    buttons: {
      processing: "Procesando...",
      generate: "Generar Imagen Mejorada"
    },
    messages: {
      noCustomization: "No hay opciones de personalización disponibles para este servicio."
    },
    app: {
      title: "Foxholm AI",
      altLogo: "Logo de Foxholm"
    },
    defaultSubdomains: [
      { name: 'Retrato', path: 'headshot' },
      { name: 'Restaurar', path: 'restore' },
      { name: 'Mejorar', path: 'upscale' }
    ],
    imageUploader: {
      dropText: 'Suelta tu imagen aquí',
      clickText: 'o haz clic para seleccionar • JPG, PNG, GIF',
      changeButton: 'Cambiar imagen',
      errors: {
        invalidType: 'Tipo de archivo no válido. Por favor, sube una imagen JPG, PNG o WebP.',
        fileTooLarge: 'El archivo es demasiado grande. El tamaño máximo es de {{maxSize}}MB.',
        dimensionsTooLarge: 'Las dimensiones de la imagen son demasiado grandes. El tamaño máximo es de {{maxDimension}}x{{maxDimension}} píxeles.',
        processError: 'Error al procesar la imagen. Por favor, intenta con otro archivo.',
        invalidFile: 'Archivo de imagen no válido. Por favor, intenta con otro archivo.'
      }
    },
    processingStatus: {
      advertisement: 'Publicidad',
      adDimensions: '360 x 450',
      messages: [
        'Inicializando...',
        'Subiendo imagen...',
        'Analizando contenido...',
        'Aplicando mejoras de IA...',
        'Generando resultado...',
        'Finalizando...'
      ],
      timeEstimate: 'Tiempo de procesamiento: 20-30 segundos'
    },
    resultDisplay: {
      aria: {
        regionLabel: 'Resultados del procesamiento de imágenes'
      },
      comparisonView: {
        enhanced: 'Mejorada',
        original: 'Original',
        compare: 'Comparar',
        resultOnly: 'Solo resultado'
      },
      processingDetails: {
        title: 'Detalles del procesamiento',
        original: 'Original',
        enhanced: 'Mejorada',
        detected: 'Detectado',
        processedAt: 'Procesado el',
        dimensions: '{{width}} × {{height}}'
      },
      actions: {
        download: '⬇ Descargar imagen',
        downloadComplete: '✓ ¡Descargada!',
        tryAnother: '🔄 Probar otra'
      },
      share: {
        title: '¡Mira mi imagen mejorada con IA!',
        text: 'Creado con Foxholm AI Image Tools',
        linkCopied: '¡Enlace copiado al portapapeles!',
        satisfactionPrompt: '¿Contento con el resultado? ¡Comparte tu experiencia!',
        social: {
          twitter: 'Twitter',
          facebook: 'Facebook',
          instagram: 'Instagram'
        }
      }
    }
  }
};
