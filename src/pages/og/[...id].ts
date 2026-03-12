/** @link https://cowboy.codes/blog/automated-og-with-astro */
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import satori from "satori";
import sharp from "sharp";
import { siteDefaults } from "@utils/siteDefaults";

// use only posts for now - this is an expensive operation (~300ms each page)
const posts = await getCollection("posts");
// const pages = await getCollection("pages");
// const reviews = await getCollection("reviews");
const allEntries = [...posts];

export const GET: APIRoute = async ({ params, request }) => {
    const id = params.id;
    const entry = allEntries.find((entry) => `${entry.id}.png` == id);

    const entryTitle = entry?.data.title;
    const entrySummary = entry?.data.summary;

    const margin = 64;
    const marginHalf = margin / 2;

    const svg = await satori(
        {
            type: "div",
            props: {
                style: {
                    display: "flex",
                    flexDirection: "column",
                    background: "#f9f8f4",
                    color: "#272624",
                    height: "100%",
                    width: "100%",
                },
                children: [
                    {
                        type: "img",
                        props: {
                            src: `${siteDefaults.domain}/svg/og_bg.svg`,
                            width: 1200,
                            height: 630,
                            style: {
                                position: "absolute",
                                top: 0,
                                zIndex: 0,
                            },
                        },
                    },
                    {
                        // header
                        type: "div",
                        props: {
                            style: {
                                display: "flex",
                                gap: "12px",
                                marginLeft: margin * 2,
                                marginTop: margin,
                                fontSize: "20px",
                                fontFamily: "Ambra Sans",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "2px",
                            },
                            children: [
                                {
                                    type: "div",
                                    props: {
                                        children: "Daniel Saunders",
                                    },
                                },
                                {
                                    type: "img",
                                    props: {
                                        src: `${siteDefaults.domain}/svg/kensington_star4.svg`,
                                        width: 20,
                                        height: 20,
                                        style: {
                                            position: "relative",
                                            top: "2px",
                                        },
                                    },
                                },
                                {
                                    type: "div",
                                    props: {
                                        children: entry?.collection,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        // title
                        type: "div",
                        props: {
                            style: {
                                fontSize: "76px",
                                fontFamily: "Kensington",
                                marginRight: margin,
                                marginLeft: margin * 2,
                                marginTop: margin * 2,
                            },
                            children: entryTitle,
                        },
                    },
                    {
                        // summary
                        type: "div",
                        props: {
                            style: {
                                fontSize: "28px",
                                fontFamily: "Ambra Sans",
                                fontWeight: 400,
                                lineHeight: 1.4,
                                marginLeft: margin * 2,
                                marginRight: margin * 3,
                                marginTop: marginHalf,
                            },
                            children: entrySummary,
                        },
                    },
                ],
            },
        },
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: "Kensington",
                    data: await fetch(
                        `${siteDefaults.domain}/fonts/Kensington-CompressedBlack.woff`,
                    ).then((res) => res.arrayBuffer()),
                    weight: 900,
                    style: "normal",
                },
                {
                    name: "Ambra Sans",
                    data: await fetch(
                        `${siteDefaults.domain}/fonts/Ambra-Sans-Text-Bold.woff`,
                    ).then((res) => res.arrayBuffer()),
                    weight: 700,
                    style: "normal",
                },
                {
                    name: "Ambra Sans",
                    data: await fetch(
                        `${siteDefaults.domain}/fonts/Ambra-Sans-Text-Regular.woff`,
                    ).then((res) => res.arrayBuffer()),
                    weight: 400,
                    style: "normal",
                },
            ],
        },
    );

    const imgBuffer = Buffer.from(svg);

    return new Response(
        (await sharp(imgBuffer).resize(1200, 630).png().toBuffer()) as BodyInit,
    );
};

export async function getStaticPaths() {
    return allEntries.map((entry) => ({
        params: {
            // id: `${entry.collection}_${entry.id.replace("/", "-")}.png`,
            id: `${entry.id}.png`,
        },
    }));
}
