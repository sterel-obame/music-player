module.exports = function (api) {
  // Active la mise en cache pour améliorer les performances
  api.cache(true);
  
  return {
    // Presets utilisés (ici le preset Expo)
    presets: ['babel-preset-expo'],
    
    // Plugins Babel supplémentaires
    plugins: [
      'react-native-reanimated/plugin',
      [
        // Plugin module-resolver (pour les alias d'import)
        'module-resolver',
        {
          // Répertoire racine pour les résolutions
          root: ['./src'],
          
          // Alias personnalisés pour les imports
          alias: {
            Constants: './src/Constants',
            Assets: './assets',
            Navigation: './src/Navigation',
            Components: './src/Components',
            Screens: './src/Screens',
            context:'./src/context',
            hooks:'./src/hooks',
            utils:'./src/utils',
            services:'./src/services',
          },
        },
      ],
    ],
  };
};