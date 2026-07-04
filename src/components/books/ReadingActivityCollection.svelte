<script lang="ts">
    import { isBefore, diffDays, tzDate, isAfter } from "@formkit/tempo";
    import type { ReadingActivity } from "../../utils/types";
    import ReadingActivityItem from "./ReadingActivityItem.svelte";
    import { fade, slide } from "svelte/transition";
    import v from "voca";

    interface Props {
        activityItems: ReadingActivity[];
    }

    let { activityItems }: Props = $props();

    const statusFilters = [
        { name: "All Activity", value: "all" },
        { name: "Currently Reading", value: "current" },
        { name: "Have Read", value: "read" },
        { name: "Finished", value: "finished" },
    ];

    // todo: get previous years dynamically from collection
    const dateFilters = [
        { name: "All", value: "all" },
        { name: "Last 30 Days", value: "30d" },
        { name: "Last 90 Days", value: "90d" },
        { name: "Year to Date", value: "2026" },
        { name: "2025", value: "2025" },
        { name: "2024", value: "2024" },
        { name: "2023", value: "2023" },
        { name: "2022", value: "2022" },
        { name: "Older", value: "older" },
    ];

    const sortOptions = [
        { name: "Newest to oldest", value: "date:desc" },
        { name: "Oldest to newest", value: "date:asc" },
        { name: "Title A-Z", value: "title:asc" },
        { name: "Title Z-A", value: "title:desc" },
    ];

    let activeStatusFilter = $state("all");
    let activeDateFilter = $state("all");
    let activeSort = $state("date:desc");

    let filteredItems = $derived.by(() => {
        let list = activityItems;
        const now = new Date();

        if (activeStatusFilter !== "all") {
            list = list.filter((item) => {
                if (
                    activeStatusFilter === "current" &&
                    item.status === "Currently Reading"
                ) {
                    return true;
                }
                if (
                    activeStatusFilter === "read" &&
                    item.status === "Have Read"
                ) {
                    return true;
                }
                if (
                    activeStatusFilter === "finished" &&
                    item.status === "Have Read" &&
                    item.finished
                ) {
                    return true;
                }
            });
        }

        if (activeDateFilter !== "all") {
            list = list.filter((item) => {
                const feedDateUTC = tzDate(item.feed_date, "UTC");

                if (
                    activeDateFilter === "30d" &&
                    diffDays(now, feedDateUTC) <= 30
                ) {
                    return true;
                }
                if (
                    activeDateFilter === "90d" &&
                    diffDays(now, feedDateUTC) <= 90
                ) {
                    return true;
                }
                if (
                    activeDateFilter === "2026" &&
                    isAfter(feedDateUTC, "2025-12-31") &&
                    isBefore(feedDateUTC, "2027-01-01")
                ) {
                    return true;
                }
                if (
                    activeDateFilter === "2025" &&
                    isAfter(feedDateUTC, "2024-12-31") &&
                    isBefore(feedDateUTC, "2026-01-01")
                ) {
                    return true;
                }
                if (
                    activeDateFilter === "2024" &&
                    isAfter(feedDateUTC, "2023-12-31") &&
                    isBefore(feedDateUTC, "2025-01-01")
                ) {
                    return true;
                }
                if (
                    activeDateFilter === "2023" &&
                    isAfter(feedDateUTC, "2022-12-31") &&
                    isBefore(feedDateUTC, "2024-01-01")
                ) {
                    return true;
                }
                if (
                    activeDateFilter === "2022" &&
                    isAfter(feedDateUTC, "2021-12-31") &&
                    isBefore(feedDateUTC, "2023-01-01")
                ) {
                    return true;
                }
                if (
                    activeDateFilter === "older" &&
                    isBefore(feedDateUTC, "2022-01-01")
                ) {
                    return true;
                }
            });
        }

        return list;
    });
    let filteredMessage = $derived(`Showing ${filteredItems.length} results`);

    let sortedItems = $derived.by(() => {
        let list = [...filteredItems];

        if (activeSort === "date:asc" || activeSort === "date:desc") {
            return list.sort((a, b) => {
                if (activeSort === "date:desc") {
                    return isBefore(a.feed_date, b.feed_date) ? 1 : -1;
                }
                return isBefore(a.feed_date, b.feed_date) ? -1 : 1;
            });
        }

        if (activeSort === "title:asc" || activeSort === "title:desc") {
            return list.sort((a, b) => {
                let titleA = v.chain(a.book.title).slugify().value();
                let titleB = v.chain(b.book.title).slugify().value();

                // strip starting `the-`s
                if (v.startsWith(titleA, "the-")) {
                    titleA = v.slice(titleA, 4);
                }
                if (v.startsWith(titleB, "the-")) {
                    titleB = v.slice(titleB, 4);
                }
                if (titleA < titleB) {
                    return activeSort === "title:asc" ? -1 : 1;
                }
                if (titleA > titleB) {
                    return activeSort === "title:asc" ? 1 : -1;
                }
                return 0;
            });
        }

        return list;
    });

    let showClearFilters = $derived.by(() => {
        if (
            activeStatusFilter !== "all" ||
            activeDateFilter !== "all" ||
            activeSort !== "date:desc"
        ) {
            return true;
        }
        return false;
    });

    function resetFilters() {
        activeStatusFilter = "all";
        activeDateFilter = "all";
        activeSort = "date:desc";
    }

    $effect(() => {
        // register state as effect dependencies
        activeStatusFilter;
        activeDateFilter;
        activeSort;
        // scroll to top when filters change
        window.scrollTo(0, 0);
    });
</script>

<div class="with-sidebar" data-sidebar="left">
    <div class="sidebar-panel">
        <p class="sidebar-note">
            <strong>NB:</strong> The “Have Read” category includes both completed
            books and those left unfinished.
        </p>
        <div class="activity__filters | flow" data-tempo="allegro">
            <fieldset class="filter__status">
                <legend>Filter by Status</legend>
                {#each statusFilters as statusFilter}
                    <div class="radio-item">
                        <label>
                            <input
                                type="radio"
                                value={statusFilter.value}
                                bind:group={activeStatusFilter}
                            />
                            {statusFilter.name}
                        </label>
                    </div>
                {/each}
            </fieldset>
            <div class="filter__date">
                <label for="dateFilter">Filter by Date</label>
                <select id="dateFilter" bind:value={activeDateFilter}>
                    {#each dateFilters as dateFilter}
                        <option value={dateFilter.value}
                            >{dateFilter.name}</option
                        >
                    {/each}
                </select>
            </div>
            <div class="filter__sort">
                <label for="sort">Sort by</label>
                <select id="sort" bind:value={activeSort}>
                    {#each sortOptions as option}
                        <option value={option.value}>{option.name}</option>
                    {/each}
                </select>
            </div>
            {#if showClearFilters}
                <button class="reset-filters" onclick={resetFilters}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 640"
                        width="16"
                        height="16"
                        aria-hidden="true"
                        ><path
                            d="M182.9 137.4L160.3 114.7L115 160L137.6 182.6L275 320L137.6 457.4L115 480L160.3 525.3L182.9 502.6L320.3 365.3L457.6 502.6L480.3 525.3L525.5 480L502.9 457.4L365.5 320L502.9 182.6L525.5 160L480.3 114.7L457.6 137.4L320.3 274.7L182.9 137.4z"
                        /></svg
                    >
                    Reset All Filters
                </button>
            {/if}
            <div class="back-to-top">
                <a href="#top">Top</a>
            </div>
        </div>
    </div>
    <div class="main-panel">
        <p><em>{filteredMessage}</em></p>
        <div class="activity__items | flow" data-tempo="adagio">
            {#each sortedItems as item (item.id)}
                <div transition:fade|global>
                    <ReadingActivityItem activityItem={item} />
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .with-sidebar {
        --sidebar-min-width: 14rem;
        --sidebar-gap: var(--space-l);
    }

    .main-panel {
        border-inline-start: 1px solid var(--site-border);
        padding-inline-start: var(--sidebar-gap);
    }

    .sidebar-note {
        font-size: var(--step--1);
        margin-block-end: var(--space-s);
    }

    .activity__filters {
        position: sticky;
        top: var(--space-m);

        & .back-to-top {
            font-size: var(--step--1);
        }
    }

    .activity__items {
        margin-block-start: var(--space-m);
    }

    .filter__status {
        border: 0;

        & legend {
            font-size: var(--step--1);
            font-weight: 700;
            margin-block-end: var(--space-3xs);
        }

        & .radio-item {
            font-size: var(--step--1);

            &:not(:first-of-type) {
                margin-block-start: 0.25rem;
            }
        }
    }

    :is(.filter__sort, .filter__date) {
        & label {
            display: block;
            font-size: var(--step--1);
            font-weight: 700;
            margin-block-end: var(--space-3xs);
        }

        & select {
            font-size: var(--step--1);
            padding: 0.25rem 0.5rem;
        }
    }

    .reset-filters {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        color: var(--site-accent);
        border: 1px solid color-mix(in srgb, var(--site-accent), white 85%);
        font-size: var(--step--1);
        border-radius: 0.25rem;
        padding: 0.25rem 0.75rem;
        transition: background-color 0.2s;

        &:hover {
            --svg-fill: var(--site-text--reverse);
            background-color: var(--site-accent);
            color: var(--site-text--reverse);
        }

        & svg {
            position: relative;
            top: 0.5px;
            fill: var(--svg-fill, var(--site-accent));
        }
    }
</style>
