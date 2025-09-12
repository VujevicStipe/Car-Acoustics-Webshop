import styles from "./ProductSpecsTable.module.css";

type SpecField = { key: string; label: string };

type Props = {
  specs: Record<string, string | number>;
  fields: SpecField[];
};

export default function SpecsTable({ specs, fields }: Props) {
  return (
    <table className={styles.specsTable}>
      <tbody>
        {fields.map(({ key, label }) => {
          const value = specs[key];
          if (!value) return null;
          return (
            <tr key={key} className={styles.specsRow}>
              <td className={styles.specsLabel}>{label}</td>
              <td className={styles.specsValue}>{value}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
