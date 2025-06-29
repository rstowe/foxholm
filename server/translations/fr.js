// Server-side translations for subdomain configurations - French
module.exports = {
  headshot: {
    title: 'Générateur de photos professionnelles par IA',
    description: 'Transformez n\'importe quelle photo en photo professionnelle en quelques secondes',
    features: ['Styles professionnels', 'Options d\'arrière-plan', 'Formats multiples'],
    formFields: {
      style: {
        label: 'Sélection du style',
        options: [
          { value: 'corporate', label: 'Professionnel d\'entreprise' },
          { value: 'creative', label: 'Professionnel créatif' },
          { value: 'linkedin', label: 'Optimisé pour LinkedIn' },
        ]
      },
      background: {
        label: 'Préférence d\'arrière-plan',
        options: [
          { value: 'office', label: 'Environnement de bureau' },
          { value: 'solid', label: 'Couleur unie' },
          { value: 'gradient', label: 'Dégradé' },
        ]
      },
      clothing: {
        label: 'Ajustements de style',
        options: [
          { value: 'suit', label: 'Ajouter un costume ou une veste' },
          { value: 'business-casual', label: 'Ajouter une tenue décontractée professionnelle' },
          { value: 'touchup', label: 'Retouche faciale professionnelle' }
        ]
      },
      outputFormat: {
        label: 'Format de sortie',
        options: [
          { value: 'square', label: 'Carré (LinkedIn)' },
          { value: 'portrait', label: 'Portrait (CV)' },
        ]
      }
    },
    seo: {
      title: 'Générateur de Photos Professionnelles par IA - Outil en Ligne Gratuit | Foxholm',
      description: 'Transformez n\'importe quelle photo en photo professionnelle en quelques secondes. Parfait pour LinkedIn, CV et profils professionnels. Pas besoin de photographe.',
      keywords: ['générateur de photo IA', 'photo professionnelle IA', 'créateur de photo LinkedIn']
    }
  },
  
  restore: {
    title: 'Restauration et Amélioration de Photos par IA',
    description: 'Restaurez des photos anciennes, endommagées ou décolorées avec une IA avancée',
    features: ['Suppression des rayures', 'Restauration des couleurs', 'Réparation des dommages'],
    formFields: {
      colorization: {
        label: 'Ajuster les couleurs',
        options: [
          { value: 'maintain', label: 'Conserver la couleur d\'origine' },
          { value: 'recreate', label: 'Recréer une photo vintage' },
          { value: 'colorize', label: 'Coloriser la photo' },
          { value: 'desaturate', label: 'Désaturer la photo' },
        ]
      }
    },
    seo: {
      title: 'Restauration de Photos par IA - Restaurez vos Anciennes Photos | Foxholm',
      description: 'Restaurez instantanément des photos anciennes, endommagées ou décolorées avec l\'IA. Réparez les rayures, les déchirures et la décoloration. Redonnez vie à vos souvenirs familiaux.',
      keywords: ['restaurer anciennes photos IA', 'restauration photo en ligne', 'réparer photos endommagées']
    }
  },
  
  upscale: {
    title: 'Amélioration de la Résolution par IA',
    description: 'Améliorez la résolution des images jusqu\'à 8x sans perte de qualité',
    features: ['Jusqu\'à 8x de résolution', 'Amélioration intelligente', 'Réduction du bruit'],
    formFields: {
      targetResolution: {
        label: 'Résolution cible',
        options: [
          { value: '2x', label: '2x (Recommandé)' },
          { value: '4x', label: '4x (Haute qualité)' },
          { value: '8x', label: '8x (Maximum)' },
          { value: 'custom', label: 'Taille personnalisée' }
        ]
      },
      enhancementType: {
        label: 'Type d\'amélioration',
        options: [
          { value: 'photo', label: 'Photo (Visages & Détails)' },
          { value: 'artwork', label: 'Œuvre d\'art (Illustrations)' },
          { value: 'text', label: 'Texte (Documents)' },
          { value: 'general', label: 'Général' }
        ]
      },
      noiseReduction: {
        label: 'Réduction du bruit',
        unit: '%',
      },
      sharpeningLevel: {
        label: 'Niveau de netteté',
        unit: '%',
      }
    },
    seo: {
      title: 'Amélioration de Résolution par IA - Augmentez la Résolution 8x Gratuitement | Foxholm',
      description: 'Augmentez la résolution des images jusqu\'à 8x sans perte de qualité. Parfait pour l\'impression, le web ou l\'amélioration de photos anciennes. Propulsé par une IA avancée.',
      keywords: ['augmenter résolution IA', 'augmenter résolution image', 'améliorer photo en ligne']
    }
  },
  
  // Common field types
  fieldTypes: {
    radio: 'radio',
    select: 'sélection',
    slider: 'curseur',
  },
  
  // Common slider settings
  sliderSettings: {
    min: 0,
    max: 100,
    step: 10,
    default: 0
  }
};
