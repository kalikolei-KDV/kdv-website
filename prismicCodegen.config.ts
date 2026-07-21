import type { Config } from "prismic-ts-codegen";

const config: Config = {
  output: "./app/prismicio-types.d.ts",
  models: ["./customtypes/**/index.json", "./app/slices/**/model.json"],
};

export default config;
