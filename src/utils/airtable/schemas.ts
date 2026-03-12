import { z } from "astro/zod";
import {
    airtableConfig,
    type AirtableRecord,
    type AirtableTableID,
} from "./config";

/** SCHEMAS */

/** Books schema */
export const booksSchema = z.object({
    full_title: z.string(),
    title: z.string(),
    subtitle: z.string().optional(),
    cover: z.any().optional(),
    author_refs_name: z.array(z.string()),
    shelf_refs: z.array(z.string()).optional(),
    shelf_refs_name: z.array(z.string()).optional(),
    page_count: z.number(),
    own: z.boolean().optional(),
    publisher: z.string().optional(),
    publish_date: z.string().optional(),
    edition_notes: z.string().optional(),
    series_name: z.string().optional(),
    series_number: z.number().optional(),
    isbn: z.string().optional(),
    format: z.string().optional(),
    open_library_id: z.string().optional(),
    open_library_url: z.string().optional(),
});

export const booksMap = new Map<string, { label: string }>([
    ["fldFrLawV5lvpkdSK", { label: "full_title" }],
    ["fldeaW5v1d5hDDlct", { label: "title" }],
    ["fldmxfzZCXUAGUK4B", { label: "subtitle" }],
    ["fldzsPiopP5cKIbIZ", { label: "cover" }],
    ["flda7YzOmMCTooNYb", { label: "author_refs_name" }],
    ["fldiE1mbB0w6SFjzL", { label: "shelf_refs" }],
    ["fldP1f9dAEutLAHAE", { label: "shelf_refs_name" }],
    ["fld6QxVFGkyIEtlou", { label: "page_count" }],
    ["fldCixuPBT3KpC99I", { label: "own" }],
    ["fld8imscQ6n4ePpxA", { label: "publisher" }],
    ["fldJ7tAYVcCRZdojf", { label: "publish_date" }],
    ["fldAxNHRZaJVfpJ7K", { label: "edition_notes" }],
    ["fldDPLqghVDb9Da9C", { label: "series_name" }],
    ["fldq26F61FN59zsYz", { label: "series_number" }],
    ["fldsoQcTW4IQTq9qR", { label: "isbn" }],
    ["fldWphBvM79DQ1tIp", { label: "format" }],
    ["fldeOObtVophpWtkI", { label: "open_library_id" }],
    ["fld8MWfei9oDd7FhY", { label: "open_library_url" }],
]);

/** Shelves schema */
export const shelvesSchema = z.object({
    name: z.string(),
    book_refs: z.array(z.string()).optional(),
    book_count: z.number().optional(),
});

/** Dictionary that maps shelf ids to names */
export const shelvesMap = new Map<string, { label: string }>([
    ["fldNFgBiC822esCmc", { label: "name" }],
    ["fldJgCN8sJ20NVn1l", { label: "book_refs" }],
    ["fldPJsO03IBj1yY8q", { label: "book_count" }],
]);

/** UTILITIES */

/** Use to create fields filter for passing to fetch params */
export function convertMapToURLFields(
    map: Map<string, { label: string }>,
): [string, string][] {
    const params: [string, string][] = [];
    for (const k of map.keys()) {
        params.push(["fields", k]);
    }

    return params;
}

/** Use to transform incoming Airtable record keys (using IDs) to human-readable labels (for Zod schema) */
export function convertMapIDsToLabels(
    map: Map<string, { label: string }>,
    data: AirtableRecord[],
): AirtableRecord[] {
    return data.map((record) => {
        const mappedFields: [string, any][] = [];
        for (const [k, v] of Object.entries(record.fields)) {
            if (map.has(k)) {
                const mapVal = map.get(k);
                mappedFields.push([mapVal?.label ?? k, v]);
            } else {
                mappedFields.push([k, v]);
            }
        }

        return {
            id: record.id,
            createdTime: record.createdTime,
            fields: Object.fromEntries(mappedFields),
        };
    });
}

/** Use to create a Zod schema from map properites
 * @deprecated Doesn't seem to work to dynamically build Zod type
 */
// export function convertMapToSchema(
//     map: Map<string, { label: string; schema: z.ZodType }>,
// ): z.ZodType {
//     const schemas: Record<string, any> = {};
//     for (const v of map.values()) {
//         schemas[v.label] = v.schema;
//     }

//     return z.object({
//         ...schemas,
//     });
// }

/** switcher to dynamically generate schema in loader func based on tableID */
export function getTableSchema(
    tableID: AirtableTableID,
): z.ZodType | undefined {
    let schema: z.ZodType | undefined = undefined;
    switch (tableID) {
        case airtableConfig.tableNames.Activity:
            // activity
            break;
        case airtableConfig.tableNames.Books:
            // books
            break;
        case airtableConfig.tableNames.Shelves:
            // shelves
            schema = shelvesSchema;
    }

    return schema;
}
