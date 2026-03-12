export const airtableConfig = {
    tableIDs: {
        tblr6UI7PA9ETQlOg: "Activity",
        tbliOPSxi5cCB1Lku: "Books",
        tblaPRlCv6E4J4yP9: "Shelves",
    },
    tableNames: {
        Activity: "tblr6UI7PA9ETQlOg",
        Books: "tbliOPSxi5cCB1Lku",
        Shelves: "tblaPRlCv6E4J4yP9",
    },
} as const;
export type AirtableTableID = keyof typeof airtableConfig.tableIDs;

export type AirtableRecord = {
    id: string;
    createdTime: string;
    fields: Record<string, any>;
};
