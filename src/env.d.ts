/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly YOUTUBE_API_KEY: string;
    readonly THINGIVERSE_API_TOKEN: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}