import type { ProductResponse } from "../../types";

interface ProductSpecsProps {
  product: ProductResponse;
  isOutOfStock: boolean;
formatDate:(s:string)=>string;
}

export default function ProductSpecs({
  product,
  isOutOfStock,
    formatDate,
}: ProductSpecsProps) {

  const specs = [

    {
      label: "Thương hiệu",
      value: product.brandName,
    },

    {
      label: "Danh mục",
      value: product.categoryName,
    },

    product.screenSize
      ? {
          label: "Màn hình",
          value: `${product.screenSize}"`,
        }
      : null,

    product.ram
      ? {
          label: "RAM",
          value: `${product.ram} GB`,
        }
      : null,

    product.storage
      ? {
          label: "Bộ nhớ trong",
          value: `${product.storage} GB`,
        }
      : null,

    product.battery
      ? {
          label: "Pin",
          value: `${product.battery.toLocaleString()} mAh`,
        }
      : null,

    {
      label: "Tình trạng",
      value: isOutOfStock
        ? "Hết hàng"
        : `Còn ${product.stockQuantity} sản phẩm`,
    },

    {
      label: "Ngày thêm",
      value: formatDate(product.createdAt),
    },

  ].filter(Boolean);

  return (
    <table
      className="w-full text-xs"
      aria-label="Thông số kỹ thuật"
    >
      <tbody>

        {specs.map((row, i) => (

          <tr
            key={row!.label}
            className={`
              border-b border-slate-50
              ${i % 2 ? "bg-slate-50/60" : ""}
            `}
          >

            <td className="py-2.5 pr-4 text-slate-500 w-[45%]">
              {row!.label}
            </td>

            <td className="py-2.5 text-slate-700 font-medium">
              {row!.value}
            </td>

          </tr>

        ))}

      </tbody>
    </table>
  );
}
