# TypeScriptRecommendations
Provides recommended settings for TypeScript

[![status-badge](https://ci.nuth.ch/api/badges/manuth/TypeScriptRecommendations/status.svg)](https://ci.nuth.ch/manuth/TypeScriptRecommendations)

## Usage
Simply inherit the settings provided by this module by setting the `extends`-options of the `tsconfig.json`-file:
```json
{
    "extends": "@manuth/tsconfig/recommended",
    "compileOnSave": true,
    "compilerOptions": {
        "rootDir": "./src",
        "module": "commonjs",
        "lib": [
            "es7"
        ],
        "target": "es6",
        "outDir": "./lib"
    }
}
```

By setting this option your tsconfig-file will inherit the `recommended.json`-settings located in the `@manuth/tsconfig`-module.

### Configurations
Currently `TypeScriptRecommendations` provides following configuration-presets:
  - `@manuth/tsconfig/recommended`:  
    manuth's recommended settings
