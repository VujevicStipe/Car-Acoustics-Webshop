import React from "react";
import styles from "./CartItemCard.module.css";
import ButtonComponent from "@/app/[locale]/components/button/ButtonComponent";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import useDeviceType from "@/app/hooks/useWindowSize";

type CartItemCardProps = {
  item: CartItem;
  onQuantityChange: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
};

export default function CartItemCard({
  item,
  onQuantityChange,
  onRemove,
}: CartItemCardProps) {
  const deviceType = useDeviceType();

  const handleIncrement = () => onQuantityChange(item._id, item.quantity + 1);
  const handleDecrement = () => {
    if (item.quantity > 1) {
      onQuantityChange(item._id, item.quantity - 1);
    }
  };

  const handleRemove = () => onRemove(item._id);

  return (
    <div className={`${styles.cartItemCard} ${styles[deviceType]}`}>
      <Link href={`/product/${item._id}`}>
        <div className={styles.imgWrapper}>
          <img src={item.imageUrl} alt={item.name} className={styles.image} />
        </div>
      </Link>
      <div className={styles.info}>
        <Link href={`/product/${item._id}`}>
          <div className={styles.mainInfo}>
            <h3>{item.name}</h3>
            <p>Cijena: {item.price} €</p>
            <p className={styles.stock}>Stanje: {item.stock} komada</p>
          </div>
        </Link>
        <div className={styles.quantityPrice}>
          <div className={styles.quantityControl}>
            <ButtonComponent
              variant="tertiary"
              color="orange"
              onClick={handleDecrement}
            >
              -
            </ButtonComponent>
            <span className={styles.span}>{item.quantity}</span>
            <ButtonComponent
              variant="tertiary"
              color="orange"
              onClick={handleIncrement}
            >
              +
            </ButtonComponent>
            <p className={styles.totalItemPrice}>
              Ukupno:
              <span className={styles.span}>
                {" "}
                {item.price * item.quantity}€
              </span>
            </p>
          </div>
        </div>
        <button
          className={styles.trashButton}
          onClick={handleRemove}
          aria-label="Remove item"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
