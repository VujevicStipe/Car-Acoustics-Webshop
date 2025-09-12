import React from "react";
import styles from "./DashboardContainer.module.css";
import ProductForm from "../../dashboard/components/products/products-form/ProductForm";

export default function DashboardContainer() {
  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <ProductForm mode="create" />
    </div>
  );
}
