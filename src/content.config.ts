import { defineCollection, reference } from "astro:content";
import { z } from "astro/zod";
import { glob, file } from "astro/loaders";
import { customAirtableLoader } from "@utils/airtable/customAirtableLoader";
import {
    booksMap,
    booksSchema,
    convertMapToURLFields,
    shelvesMap,
    shelvesSchema,
} from "@utils/airtable/schemas";
import { airtableConfig } from "@utils/airtable/config";

const pages = defineCollection({
    loader: glob({
        pattern: "**/*.(md|mdx)",
        base: "./src/content/pages",
    }),
    schema: z.object({
        title: z.string(),
        summary: z.string().optional(),
        template: z.string().optional(),
        updated_date: z.coerce.date().optional(),
        meta: z
            .object({
                title: z.string().optional(),
                description: z.string().optional(),
            })
            .optional(),
        openGraph: z
            .object({
                title: z.string().optional(),
                description: z.string().optional(),
            })
            .optional(),
    }),
});

const posts = defineCollection({
    loader: glob({
        pattern: "**/*.(md|mdx)",
        base: "./src/content/posts",
    }),
    schema: z.object({
        title: z.string(),
        summary: z.string(), // req for rss
        date: z.coerce.date(),
        updated_date: z.coerce.date().optional(),
        category: reference("postCategories"),
        tags: z.array(reference("postTags")).optional(),
        draft: z.boolean().optional(),
        archived: z.boolean().optional(),
    }),
});

const postCategories = defineCollection({
    loader: file("./src/content/posts/postCategories.yaml"),
    schema: z.object({
        title: z.string(),
        ornament: z.union([
            z.literal("gothic"),
            z.literal("fleur"),
            z.literal("manicule"),
            z.literal("star3"),
        ]),
        description: z.string().optional(),
    }),
});

const postTags = defineCollection({
    loader: file("./src/content/posts/postTags.yaml"),
    schema: z.object({
        title: z.string(),
    }),
});

const reviews = defineCollection({
    loader: glob({
        pattern: "**/*.(md|mdx)",
        base: "./src/content/library/reviews",
    }),
    schema: z.object({
        title: z.string(),
        summary: z.string(), // req for rss
        date: z.coerce.date(),
        rating: z
            .enum([
                "1.0",
                "1.5",
                "2.0",
                "2.5",
                "3.0",
                "3.5",
                "4.0",
                "4.5",
                "5.0",
            ])
            .optional(),
        updated_date: z.coerce.date().optional(),
        book: reference("books").optional(),
        tags: z.array(reference("postTags")).optional(),
    }),
});

const updates = defineCollection({
    loader: glob({
        pattern: "**/*.(md|mdx)",
        base: "./src/content/now-updates",
    }),
    schema: z.object({
        title: z.string(),
        date: z.coerce.date(),
        summary: z.string(), // req for rss
        archived: z.boolean().optional(),
    }),
});

const siteNavigation = defineCollection({
    loader: file("./src/content/siteNavigation.yaml"),
    schema: z.object({
        title: z.string(),
        numeral: z.string(),
        description: z.string(),
        links: z.array(
            z.object({
                title: z.string(),
                href: z.string(),
                external: z.boolean().nullish(),
            }),
        ),
        order: z.number(),
    }),
});

const linkroll = defineCollection({
    loader: file("./src/content/linkroll.yaml"),
    schema: z.object({
        name: z.string(),
        href: z.url(),
        favicon: z.url().optional(),
        description: z.string().optional(),
        tags: z
            .array(
                z.enum([
                    "blog",
                    "design",
                    "webdev",
                    "portfolio",
                    "podcast",
                    "music",
                ]),
            )
            .optional(),
    }),
});

const books = defineCollection({
    loader: customAirtableLoader({
        // schema
        tableID: airtableConfig.tableNames.Books,
        additionalParams: [
            ...convertMapToURLFields(booksMap),
            ["view", "viwPZ6FZ4LbNs1Qoj"], // display on web view
        ],
    }),
    schema: booksSchema,
});

const shelves = defineCollection({
    loader: customAirtableLoader({
        // schema
        tableID: "tblaPRlCv6E4J4yP9",
        additionalParams: [
            ...convertMapToURLFields(shelvesMap),
            ["view", "viwZVJrFff4uMXeSO"], // sorted view
        ],
    }),
    schema: shelvesSchema,
});

export const collections = {
    pages,
    posts,
    postCategories,
    postTags,
    reviews,
    siteNavigation,
    linkroll,
    books,
    shelves,
    updates,
};
