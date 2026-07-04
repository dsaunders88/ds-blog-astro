<script lang="ts">
    import type { ReadingActivity } from "../../utils/types";
    import { diffDays, diffWeeks, tzDate, format } from "@formkit/tempo";

    interface Props {
        activityItem: ReadingActivity;
    }

    let { activityItem }: Props = $props();

    let percentReadFormatted = $derived.by(() => {
        if (activityItem.percent_read) {
            return new Intl.NumberFormat("en-US", {
                style: "percent",
                maximumFractionDigits: 0,
            }).format(activityItem.percent_read);
        }
        return "";
    });

    let progressDescription = $derived.by(() => {
        if (activityItem.finished) {
            return `${activityItem.pages_read} pages read in ${activityItem.weeks_read} ${activityItem.weeks_read === 1 ? "week" : "weeks"}`;
        }
        return `${activityItem.pages_read} of ${activityItem.book.page_count} pages read in ${activityItem.weeks_read} ${activityItem.weeks_read === 1 ? "week" : "weeks"}`;
    });

    // let relativeDate = $derived.by(() => {
    //     const now = new Date();

    //     return (
    //         diffWeeks(now, tzDate(activityItem.feed_date, "UTC")) + " weeks ago"
    //     );
    // });
</script>

<article class="activity__item | flow">
    <header class="header | cluster">
        <time
            datetime={format({
                date: activityItem.feed_date,
                format: "YYYY-MM-DD",
                tz: "UTC",
            })}
        >
            <span>
                {format({
                    date: activityItem.feed_date,
                    format: "medium",
                    tz: "UTC",
                })}
            </span>
        </time>
        <span>
            <svg
                aria-hidden="true"
                fill="var(--site-accent)"
                version="1.1"
                viewBox="-10 0 457 940"
                width="14"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                ><g transform="matrix(1 0 0 -1 0 752)"
                    ><path
                        d="M198 113l12 169l-113 -127l-36 35l128 112l-169 -12v51l169 -10l-128 111l36 36l113 -127l-12 168h50l-11 -168l112 127l36 -36l-128 -111l170 10v-51l-170 12l128 -111l-36 -36l-112 127l11 -169h-50z"
                        fill="var(--site-accent)"
                    ></path></g
                ></svg
            >
        </span>
        <p>Marked as {activityItem.status}</p>
    </header>
    <div class="book-preview content">
        <a
            class="image-wrapper"
            href={`/library/books/${activityItem.book.id}`}
        >
            <img
                src={activityItem.book.cover?.src}
                alt={activityItem.book.cover?.attributes.alt}
                {...activityItem.book.cover?.attributes}
            />
        </a>
        <div class="text-wrapper">
            <header>
                <h3 class="activity__title title">
                    <a
                        class="title-link"
                        href={`/library/books/${activityItem.book.id}`}
                        >{activityItem.book.title}</a
                    >
                </h3>
                <p class="activity__author">{activityItem.book.author}</p>
            </header>
            <div class="progress">
                {#if activityItem.finished}
                    <p class="completed | cluster">
                        <svg
                            width="16"
                            height="16"
                            fill="var(--site-accent)"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 640 640"
                            aria-hidden="true"
                            ><path
                                d="M557 152.9L538.2 178.8L282.2 530.8L260.2 561.1C259.5 560.4 208 508.9 105.7 406.6L83 384L128.3 338.7C130.2 340.6 171.6 382 252.4 462.8L486.4 141.1L505.2 115.2L557 152.8z"
                            /></svg
                        >
                        <strong>Finished</strong>
                    </p>
                {:else if activityItem.percent_read}
                    <div class="progress-bar | cluster">
                        <label for="progress">{percentReadFormatted} read</label
                        >
                        <progress
                            id={`progress-${activityItem.id}`}
                            max="100"
                            value={Math.round(activityItem.percent_read * 100)}
                        ></progress>
                    </div>
                {/if}
                {#if activityItem.pages_read}
                    <div class="progress-description">
                        {progressDescription}
                    </div>
                {/if}
            </div>
        </div>
    </div>
</article>

<style>
    .header {
        --flow-space: var(--space-xs);
        --cluster-space: 0.5rem;
        position: relative;
        font-size: var(--step--1);

        & time {
            font-weight: 700;
        }

        &::before {
            content: "";
            position: absolute;
            left: calc((var(--sidebar-gap) + 6px) * -1);
            top: 7px;
            width: 12px;
            height: 12px;
            border-radius: 999px;
            background-color: var(--site-bg);
            border: 1px solid
                color-mix(in srgb, var(--color-neutral-dark), white 60%);
        }
    }

    .content {
        --flow-space: var(--space-xs);
        display: grid;
        grid-template-columns: 12rem 1fr;
        gap: var(--space-m);

        & .text-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: var(--space-xs);
        }

        & .image-wrapper {
            &:hover + .text-wrapper .title a {
                color: var(--site-accent);
                text-decoration-color: var(--site-accent);
                text-underline-offset: 5px;
            }
        }

        & h3 {
            font-size: var(--step-2);
        }
    }

    .activity__author {
        /* font-size: var(--step--1); */
        margin-block-start: var(--space-3xs);
    }

    .progress {
        font-size: var(--step--1);

        & .completed {
            --cluster-space: 0.25rem;
            color: var(--site-accent);
        }
    }

    .progress-bar {
        & label {
            order: 2;
        }

        & progress[value] {
            -webkit-appearance: none;
            -moz-appearance: none;
            --bar-color: var(--site-accent);
            --bar-background: color-mix(
                in srgb,
                var(--site-accent),
                transparent 85%
            );
            --bar-radius: 0.5rem;
            border-radius: var(--bar-radius);
            height: 0.65rem;
            background-color: var(--bar-background);
            width: 10rem;
            appearance: none;
            border: none;
            margin: 0;

            &::-moz-progress-bar {
                background-color: var(--bar-color);
                border-radius: var(--bar-radius);
            }

            &::-webkit-progress-bar {
                background-color: var(--bar-background);
                border-radius: var(--bar-radius);
            }

            &::-webkit-progress-value {
                background-color: var(--bar-color);
                border-radius: var(--bar-radius);
            }
        }
    }

    .progress-description {
        margin-block-start: var(--space-3xs);
    }
</style>
