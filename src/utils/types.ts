import type { ActivitySchema, BookSchema } from "./airtable/schemas";
import type { GetImageResult } from "astro";

export interface PageMeta {
    id?: string;
    meta?: {
        title?: string;
        description?: string;
    };
    openGraph?: {
        title?: string;
        description?: string;
    };
}

export interface ReadingActivity extends ActivitySchema {
    id: string;
    book: {
        id: string;
        title: BookSchema["title"];
        subtitle: BookSchema["subtitle"];
        cover?: GetImageResult;
        author: BookSchema["author_refs_name"];
        page_count: BookSchema["page_count"];
    };
}
