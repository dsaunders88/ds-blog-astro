import type { Loader } from "astro/loaders";
import {
    airtableConfig,
    type AirtableTableID,
    type AirtableRecord,
} from "./config";
import { fetchFromAirtable } from "./fetch";
import { booksMap, convertMapIDsToLabels, shelvesMap } from "./schemas";

interface AirtableLoaderOptions {
    /** table name or ID */
    tableID: AirtableTableID;
    additionalParams?: [string, string][];
}

/** Custom Airtable Loader using only HTTP endpoint and transforming response data to Zod schema. */
export function customAirtableLoader({
    tableID,
    additionalParams,
}: AirtableLoaderOptions): Loader {
    return {
        name: "ds-airtable-loader",
        load: async ({ store, parseData, logger }) => {
            logger.info(
                `Loading Airtable data from table "${airtableConfig.tableIDs[tableID]}"`,
            );

            const allRecords: AirtableRecord[] = [];

            let shouldFetch = true;
            let offset = undefined;
            while (shouldFetch) {
                try {
                    const res = await fetchFromAirtable({
                        tableID,
                        offset,
                        additionalParams,
                    });

                    if (res.status > 299 || !res.data.records) {
                        throw new Error(
                            `failed to fetch Airtable records: ${res.status} - ${res.data.error?.message}`,
                        );
                    }

                    // console.log(res.data);
                    allRecords.push(...res.data.records);

                    if (!res.data.offset) {
                        shouldFetch = false;
                        break;
                    }

                    offset = res.data.offset;
                } catch (e) {
                    console.error(e);
                }
            }

            // transform data
            let transformed: AirtableRecord[] = [];
            switch (tableID) {
                case "tblr6UI7PA9ETQlOg":
                    // activity
                    // todo: add convertMapIDsToLabels()
                    break;
                case "tbliOPSxi5cCB1Lku":
                    // books
                    transformed = convertMapIDsToLabels(booksMap, allRecords);
                    break;
                case "tblaPRlCv6E4J4yP9":
                    // shelves
                    transformed = convertMapIDsToLabels(shelvesMap, allRecords);
                    break;
            }
            // console.log("transformed data", transformed);

            store.clear();
            for (const record of transformed) {
                const id = record.id;
                const data = await parseData({
                    id,
                    data: record.fields,
                });
                store.set({ id, data });
            }
            logger.info(
                `Loaded ${transformed.length} records from table "${airtableConfig.tableIDs[tableID]}"`,
            );
        },
        // schema: let collections override this for now
    } satisfies Loader;
}
