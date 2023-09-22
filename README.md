# THIS PROJECT IS MOVING
This project is moving to [Codeberg.org](https://codeberg.org).

If you wish to check out the most recent source code, file an issue or contribute to this project, please head to the [new repository on Codeberg.org](https://codeberg.org/lordgizmo/TypeScriptRecommendations):

<https://codeberg.org/lordgizmo/TypeScriptRecommendations>

# TypeScriptRecommendations
Provides recommended settings for TypeScript

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
