import type { AirtableTableID, AirtableRecord } from "./config";

type Props = {
    tableID: AirtableTableID;
    offset?: string;
    additionalParams?: [string, string][];
};

interface AirtableReponse {
    records?: AirtableRecord[];
    offset?: string;
    error?: {
        message: string;
    };
}

export async function fetchFromAirtable({
    tableID,
    offset,
    additionalParams,
}: Props): Promise<{ status: number; data: AirtableReponse }> {
    const url = `https://api.airtable.com/v0`;
    const token = import.meta.env.AIRTABLE_ACCESS_TOKEN;
    const base = import.meta.env.AIRTABLE_BASE_ID;

    // default pageSize = 100
    const params = new URLSearchParams([["returnFieldsByFieldId", "true"]]);
    if (offset) {
        params.append("offset", offset);
    }
    // ie. for including views & sort, filter by fields
    if (additionalParams) {
        additionalParams.forEach((item) => params.append(...item));
    }
    // console.log("fetch url", `${url}/${base}/${tableID}?${params.toString()}`);

    const res = await fetch(`${url}/${base}/${tableID}?${params.toString()}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const data: AirtableReponse = await res.json();

    return {
        status: res.status,
        data,
    };
}
