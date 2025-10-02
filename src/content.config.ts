import { defineCollection, reference, z } from "astro:content";
import { glob, file } from "astro/loaders";
import { airtableLoader } from "@ascorbic/airtable-loader";

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
            })
        ),
    }),
});

const books = defineCollection({
    loader: airtableLoader({
        base: import.meta.env.AIRTABLE_BASE_ID,
        token: import.meta.env.AIRTABLE_ACCESS_TOKEN,
        table: import.meta.env.AIRTABLE_BOOKS_TABLE_ID,
        queryParams: {
            // returnFieldsByFieldId: true,
            view: "viwPZ6FZ4LbNs1Qoj", // display books website view
            fields: [
                "fldFrLawV5lvpkdSK", // full title
                "fldeaW5v1d5hDDlct", // title
                "fldmxfzZCXUAGUK4B", // subtitle
                "fldzsPiopP5cKIbIZ", // cover
                "flda7YzOmMCTooNYb", // author full name
                "fldP1f9dAEutLAHAE", // shelf names
                "fld6QxVFGkyIEtlou", // page count
                "fldCixuPBT3KpC99I", // own
                "fld8imscQ6n4ePpxA", // publisher
                "fldJ7tAYVcCRZdojf", // published date
                "fldAxNHRZaJVfpJ7K", // edition notes
                "fldDPLqghVDb9Da9C", // series name
                "fldq26F61FN59zsYz", // series number
                "fldsoQcTW4IQTq9qR", // isbn
                "fldWphBvM79DQ1tIp", // format
                "fldeOObtVophpWtkI", // open library id
                "fld8MWfei9oDd7FhY", // open library url
            ],
        },
    }),
});

const shelves = defineCollection({
    loader: airtableLoader({
        base: import.meta.env.AIRTABLE_BASE_ID,
        token: import.meta.env.AIRTABLE_ACCESS_TOKEN,
        table: import.meta.env.AIRTABLE_SHELVES_TABLE_ID,
        queryParams: {
            fields: [
                "fldNFgBiC822esCmc", // name
                "fldJgCN8sJ20NVn1l", // book records
            ],
            sort: [{ field: "Name", direction: "asc" }],
        },
    }),
});

export const collections = {
    pages,
    posts,
    postCategories,
    postTags,
    reviews,
    siteNavigation,
    books,
    shelves,
    updates,
};
