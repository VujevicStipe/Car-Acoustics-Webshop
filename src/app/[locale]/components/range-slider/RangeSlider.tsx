"use client";

import { useState, useEffect } from "react";
import { Range } from "react-range";
import { useDebounce } from "@/app/hooks/useDebounce";
import styles from "./RangeSlider.module.css";

export default function RangeSlider({
  min,
  max,
  step = 50,
  initialMin,
  initialMax,
  onChange,
}: RangeSliderProps) {
  const [values, setValues] = useState([initialMin ?? min, initialMax ?? max]);
  const debounced = useDebounce(values, 400);

  useEffect(() => {
    onChange(debounced[0], debounced[1]);
  }, [debounced]);

  return (
    <div className={styles.sliderWrapper}>
      <div className={styles.labels}>
        <span>{values[0]} €</span>
        <span>{values[1]} €</span>
      </div>

      <Range
        values={values}
        step={step}
        min={min}
        max={max}
        onChange={setValues}
        renderTrack={({ props, children }) => (
          <div {...props} className={styles.track}>
            {children}
          </div>
        )}
        renderThumb={({ props }) => {
          const { key, ...rest } = props;
          return (
            <div key={key} {...rest} className={styles.thumb}>
              <div className={styles.thumbValue}>€</div>
            </div>
          );
        }}
      />
    </div>
  );
}
