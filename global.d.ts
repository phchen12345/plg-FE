declare module "bootstrap/dist/js/bootstrap.bundle.min.js";
declare module "*.svg" {
  import * as React from "react";
  const content: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default content;
}
declare module "*.svg?url" {
  const defaultExport: string;
  export default defaultExport;
}
