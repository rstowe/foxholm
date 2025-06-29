export default {
  // Privacy banner
  privacy: {
    noSignups: "Pas d'inscription requise",
    noImageStorage: "Nous ne stockons pas vos images",
    noCookies: "Pas de cookies"
  },
  
  // Footer
  footer: {
    copyright: "© 2025 Foxholm. Studio d'IA d'image professionnel.",
    loading: "Chargement...",
    error: "Erreur lors du chargement de la page"
  },
  
  // Common
  common: {
    separator: "|",
    loading: "Chargement de Foxholm Studio...",
    error: {
      configLoad: "Échec du chargement de la configuration de l'outil. Veuillez réessayer plus tard.",
      noImage: "Veuillez d'abord télécharger une image",
      subdomain: "Impossible de déterminer le sous-domaine à partir de l'URL",
      processing: "Échec du traitement",
      processImage: "Échec du traitement de l'image"
    },
    success: {
      resultReady: "Votre résultat amélioré est prêt !"
    },
    buttons: {
      processing: "Traitement en cours...",
      generate: "Générer l'image améliorée"
    },
    messages: {
      noCustomization: "Aucune option de personnalisation disponible pour ce service."
    },
    app: {
      title: "Foxholm AI",
      altLogo: "Logo Foxholm"
    },
    defaultSubdomains: [
      { name: 'Portrait', path: 'headshot' },
      { name: 'Restaurer', path: 'restore' },
      { name: 'Améliorer', path: 'upscale' }
    ],
    imageUploader: {
      dropText: 'Déposez votre image ici',
      clickText: 'ou cliquez pour sélectionner • JPG, PNG, GIF',
      changeButton: 'Changer l\'image',
      errors: {
        invalidType: 'Type de fichier non valide. Veuillez télécharger une image JPG, PNG ou WebP.',
        fileTooLarge: 'Le fichier est trop volumineux. La taille maximale est de {{maxSize}} Mo.',
        dimensionsTooLarge: 'Les dimensions de l\'image sont trop grandes. La taille maximale est de {{maxDimension}}x{{maxDimension}} pixels.',
        processError: 'Échec du traitement de l\'image. Veuillez essayer un autre fichier.',
        invalidFile: 'Fichier image non valide. Veuillez essayer un autre fichier.'
      }
    },
    processingStatus: {
      advertisement: 'Publicité',
      adDimensions: '360 x 450',
      messages: [
        'Initialisation...',
        'Téléchargement de l\'image...',
        'Analyse du contenu...',
        'Application des améliorations IA...',
        'Génération du résultat...',
        'Finalisation...'
      ],
      timeEstimate: 'Temps de traitement : 20-30 secondes'
    },
    resultDisplay: {
      aria: {
        regionLabel: 'Résultats du traitement d\'image'
      },
      comparisonView: {
        enhanced: 'Améliorée',
        original: 'Originale',
        compare: 'Comparer',
        resultOnly: 'Résultat uniquement'
      },
      processingDetails: {
        title: 'Détails du traitement',
        original: 'Originale',
        enhanced: 'Améliorée',
        detected: 'Détecté',
        processedAt: 'Traitement effectué le',
        dimensions: '{{width}} × {{height}}'
      },
      actions: {
        download: '⬇ Télécharger l\'image',
        downloadComplete: '✓ Téléchargée !',
        tryAnother: '🔄 Essayer une autre'
      },
      share: {
        title: 'Découvrez mon image améliorée par IA !',
        text: 'Créé avec Foxholm AI Image Tools',
        linkCopied: 'Lien copié dans le presse-papiers !',
        satisfactionPrompt: 'Satisfait du résultat ? Partagez votre expérience !',
        social: {
          twitter: 'Twitter',
          facebook: 'Facebook',
          instagram: 'Instagram'
        }
      }
    }
  }
};
