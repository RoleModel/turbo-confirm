import json from '@rollup/plugin-json'

import pack from "./package.json" assert { type: 'json' }
const year = new Date().getFullYear()
const banner = `/**\n * Turbo-Confirm v${pack.version}\n * Copyright © ${year} RoleModel Software\n */\n`

export default [
  {
    input: "src/index.js",
    output: [
      {
        file: "dist/turbo-confirm.cjs.js",
        format: "cjs",
        banner
      },
      {
        file: "dist/turbo-confirm.esm.js",
        format: "es",
        banner
      }
    ],
    plugins: [json()],
    watch: {
      include: "src/**"
    }
  }
]
