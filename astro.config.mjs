// @ts-check
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    site: "https://daniel-saunders.com",
    prefetch: {
        prefetchAll: true,
    },
    image: {
        domains: ["https://v5.airtableusercontent.com"],
    },
    markdown: {
        shikiConfig: {
            theme: "vesper",
        },
    },
    vite: {
        css: {
            transformer: "lightningcss",
            lightningcss: {
                targets: browserslistToTargets(browserslist("defaults")),
            },
        },
        build: {
            cssMinify: "lightningcss",
        },
    },

    integrations: [mdx(), sitemap()],
    redirects: {
        // internal
        "/posts/tags": "/posts/taxonomies",
        // new URLs
        "/books": "/library",
        "/posts/reviews": "/library/reviews",
        "/library/shelves": "/library/books",
        // "/posts/reviews/[...slug]": "/library/reviews/[...slug]",
        // "/tag/[...slug]": "/posts/tags/[...slug]",
        // new post locations
        "/posts/notes/building-myself-a-reading-tracker-app-with-airtable-and-deno-fresh-part-1":
            "/posts/notes/imagining-the-ideal-reading-tracker-app",
        "/posts/notes/building-myself-a-reading-tracker-app-with-airtable-and-deno-fresh-part-2":
            "/posts/tutorials/airtable-reading-tracker-backend",
        "/posts/notes/building-myself-a-reading-tracker-app-with-airtable-and-deno-fresh-part-3":
            "/posts/tutorials/airtable-reading-tracker-frontend",
        "/posts/notes/mapping-meteorites":
            "/posts/tutorials/mapping-meteorites",
        "/posts/notes/the-origin-of-capitalism":
            "/library/reviews/the-origin-of-capitalism",
        "/posts/notes/red-star-over-the-third-world":
            "/library/reviews/red-star-over-the-third-world",
        "/posts/notes/the-last-christian":
            "/posts/lists/my-year-in-reading-2016",
        "/posts/notes/a-philosophy-of-walking":
            "/posts/lists/my-year-in-reading-2016",
        "/posts/notes/notes-from-the-history-of-laughter":
            "/library/reviews/notes-from-the-history-of-laughter",
    },
});
