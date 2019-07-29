/** Global definitions for developement **/

// for style loader
declare module '*.jpg' {
  const content: any;
  export = content;
}
declare module '*.png' {
  const content: any;
  export = content;
}
declare module '*.svg' {
  export const content: string;
}

// for .sbc that are XMLs
declare module '*.sbc' {
  const content: string;
  export default content;
}
