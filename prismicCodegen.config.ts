import type { Config } from "prismic-ts-codegen";

const config: Config = {
  output: "./src/prismicio-types.d.ts",
  models: ["./customtypes/**/index.json", "./src/slices/**/model.json"],
};

export default config;