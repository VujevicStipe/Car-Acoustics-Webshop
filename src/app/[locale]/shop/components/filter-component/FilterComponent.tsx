"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { filtersByCategory } from "@/app/lib/categoryFilter";
import { Category } from "@/app/lib/categorySpecs";
import RangeSlider from "@/app/[locale]/components/range-slider/RangeSlider";
import styles from "./FilterComponent.module.css";
import useDeviceType from "@/app/hooks/useWindowSize";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ButtonComponent from "@/app/[locale]/components/button/ButtonComponent";
import { Filter, ChevronUp, ChevronDown } from "lucide-react";
import { useDebounce } from "@/app/hooks/useDebounce";

const allCategories = Object.keys(filtersByCategory) as Category[];

export default function FilterComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const deviceType = useDeviceType();
  const [isAccordionOpen, setAccordionOpen] = useState(false);

  const t = useTranslations("Index");
  const tFilter = useTranslations("Filter");

  const category = searchParams.get("category") as Category | null;
  const searchFromUrl = searchParams.get("searchText") || "";

  const [search, setSearch] = useState(searchFromUrl);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    updateUrlParam("search", debouncedSearch);
  }, [debouncedSearch]);

  const updateUrlParam = (
    key: string,
    value: string | string[] | { min: string; max: string }
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (Array.isArray(value)) {
      params.delete(key);
      value.forEach((v) => params.append(key, v));
    } else if (typeof value === "object") {
      if (value.min !== "") params.set(`${key}_min`, value.min);
      else params.delete(`${key}_min`);
      if (value.max !== "") params.set(`${key}_max`, value.max);
      else params.delete(`${key}_max`);
    } else {
      if (value === "") params.delete(key);
      else params.set(key, value);
    }

    router.push(`?${params.toString()}`);
  };

  const filters = (
    <>
      <div className={styles.filterGroup}>
        <label className={styles.label} htmlFor="searchInput">
          {tFilter("searchFor")}
        </label>
        <input
          id="searchInput"
          type="search"
          placeholder={tFilter("search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.select}
          autoComplete="off"
        />
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.label}>{tFilter("category")}</label>
        <select
          className={styles.select}
          value={category ?? ""}
          onChange={(e) => updateUrlParam("category", e.target.value)}
        >
          <option value="">{tFilter("all")}</option>
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>
              {tFilter(cat)}
            </option>
          ))}
        </select>
      </div>

      {category &&
        filtersByCategory[category]?.map(({ key, label, type, options }) => {
          if (type === "checkbox" && options) {
            const selected = searchParams.getAll(key);
            return (
              <div key={key} className={styles.filterGroup}>
                <label className={styles.label}>{label}</label>
                {options.map((opt) => (
                  <label key={opt} className={styles.checkboxWrapper}>
                    <input
                      type="checkbox"
                      checked={selected.includes(opt)}
                      onChange={() => {
                        const newValues = selected.includes(opt)
                          ? selected.filter((v) => v !== opt)
                          : [...selected, opt];
                        updateUrlParam(key, newValues);
                      }}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            );
          }

          if (type === "select" && options) {
            const selected = searchParams.get(key) || "";
            return (
              <div key={key} className={styles.filterGroup}>
                <label className={styles.label}>{label}</label>
                <select
                  className={styles.select}
                  value={selected}
                  onChange={(e) => updateUrlParam(key, e.target.value)}
                >
                  <option value="">Sve</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (type === "range") {
            const minFromUrlRaw = searchParams.get(`${key}_min`);
            const maxFromUrlRaw = searchParams.get(`${key}_max`);
            const minFromUrl =
              minFromUrlRaw !== null ? Number(minFromUrlRaw) : undefined;
            const maxFromUrl =
              maxFromUrlRaw !== null ? Number(maxFromUrlRaw) : undefined;

            return (
              <div key={key} className={styles.filterGroup}>
                <label className={styles.label}>{label}</label>
                <RangeSlider
                  min={0}
                  max={1000}
                  initialMin={minFromUrl ?? 0}
                  initialMax={maxFromUrl ?? 1000}
                  onChange={(min, max) => {
                    updateUrlParam(key, {
                      min: min === 0 ? "" : String(min),
                      max: max === 1000 ? "" : String(max),
                    });
                  }}
                />
              </div>
            );
          }

          return null;
        })}
    </>
  );

  if (deviceType === "desktop") {
    return (
      <div className={`${styles.container} ${styles[deviceType]}`}>
        {filters}
      </div>
    );
  }

  return (
    <div className={`${styles.filterStyle} ${styles[deviceType]}`}>
      <ButtonComponent
        color="black"
        variant="primary"
        onClick={() => setAccordionOpen(!isAccordionOpen)}
      >
        <Filter size={18} style={{ marginRight: "0.5rem" }} />
        {isAccordionOpen ? t("hide_filter") : t("show_filter")}
        {isAccordionOpen ? (
          <ChevronUp size={18} style={{ marginLeft: "0.5rem" }} />
        ) : (
          <ChevronDown size={18} style={{ marginLeft: "0.5rem" }} />
        )}
      </ButtonComponent>
      <div
        className={`${styles.accordionContent} ${
          isAccordionOpen ? styles.open : ""
        }`}
      >
        {filters}
      </div>
    </div>
  );
}
