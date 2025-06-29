// Server-side translations for subdomain configurations - Spanish
module.exports = {
  headshot: {
    title: 'Generador de fotos profesionales con IA',
    description: 'Transforma cualquier foto en una foto profesional en segundos',
    features: ['Estilos profesionales', 'Opciones de fondo', 'Múltiples formatos'],
    formFields: {
      style: {
        label: 'Selección de estilo',
        options: [
          { value: 'corporate', label: 'Profesional corporativo' },
          { value: 'creative', label: 'Profesional creativo' },
          { value: 'linkedin', label: 'Optimizado para LinkedIn' },
        ]
      },
      background: {
        label: 'Preferencia de fondo',
        options: [
          { value: 'office', label: 'Ambiente de oficina' },
          { value: 'solid', label: 'Color sólido' },
          { value: 'gradient', label: 'Degradado' },
        ]
      },
      clothing: {
        label: 'Ajustes de estilo',
        options: [
          { value: 'suit', label: 'Añadir traje o chaqueta' },
          { value: 'business-casual', label: 'Añadir ropa casual de negocios' },
          { value: 'touchup', label: 'Retoque facial profesional' }
        ]
      },
      outputFormat: {
        label: 'Formato de salida',
        options: [
          { value: 'square', label: 'Cuadrado (LinkedIn)' },
          { value: 'portrait', label: 'Retrato (Currículum)' },
        ]
      }
    },
    seo: {
      title: 'Generador de Fotos Profesionales con IA - Herramienta en Línea Gratuita | Foxholm',
      description: 'Transforma cualquier foto en una foto profesional en segundos. Perfecto para LinkedIn, currículums y perfiles profesionales. Sin necesidad de fotógrafo.',
      keywords: ['generador de fotos IA', 'foto profesional IA', 'creador de fotos para LinkedIn']
    }
  },
  
  restore: {
    title: 'Restauración y Mejora de Fotos con IA',
    description: 'Restaura fotos antiguas, dañadas o descoloridas con IA avanzada',
    features: ['Eliminación de rayones', 'Restauración de color', 'Reparación de daños'],
    formFields: {
      colorization: {
        label: 'Ajustar colores',
        options: [
          { value: 'maintain', label: 'Mantener color original' },
          { value: 'recreate', label: 'Recrear foto vintage' },
          { value: 'colorize', label: 'Colorear foto' },
          { value: 'desaturate', label: 'Desaturar foto' },
        ]
      }
    },
    seo: {
      title: 'Restauración de Fotos con IA - Restaura Fotos Antiguas y Dañadas | Foxholm',
      description: 'Restaura instantáneamente fotos antiguas, dañadas o descoloridas con IA. Repara rayones, rasgaduras y decoloración. Devuelve la vida a los recuerdos familiares.',
      keywords: ['restaurar fotos antiguas IA', 'restauración de fotos en línea', 'reparar fotos dañadas']
    }
  },
  
  upscale: {
    title: 'Mejora de Resolución con IA',
    description: 'Mejora la resolución de imágenes hasta 8x sin perder calidad',
    features: ['Hasta 8x de resolución', 'Mejora inteligente', 'Reducción de ruido'],
    formFields: {
      targetResolution: {
        label: 'Resolución objetivo',
        options: [
          { value: '2x', label: '2x (Recomendado)' },
          { value: '4x', label: '4x (Alta calidad)' },
          { value: '8x', label: '8x (Máximo)' },
          { value: 'custom', label: 'Tamaño personalizado' }
        ]
      },
      enhancementType: {
        label: 'Tipo de mejora',
        options: [
          { value: 'photo', label: 'Foto (Rostros y detalles)' },
          { value: 'artwork', label: 'Arte (Ilustraciones)' },
          { value: 'text', label: 'Texto (Documentos)' },
          { value: 'general', label: 'General' }
        ]
      },
      noiseReduction: {
        label: 'Reducción de ruido',
        unit: '%',
      },
      sharpeningLevel: {
        label: 'Nivel de enfoque',
        unit: '%',
      }
    },
    seo: {
      title: 'Mejora de Resolución con IA - Aumenta la Resolución 8x Gratis | Foxholm',
      description: 'Aumenta la resolución de imágenes hasta 8x sin perder calidad. Perfecto para impresión, uso web o mejorar fotos antiguas. Impulsado por IA avanzada.',
      keywords: ['aumentar resolución IA', 'aumentar resolución de imagen', 'mejorar foto en línea']
    }
  },
  
  // Common field types
  fieldTypes: {
    radio: 'radio',
    select: 'select',
    slider: 'deslizador',
  },
  
  // Common slider settings
  sliderSettings: {
    min: 0,
    max: 100,
    step: 10,
    default: 0
  }
};
