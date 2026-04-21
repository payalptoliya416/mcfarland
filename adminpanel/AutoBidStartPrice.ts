import { useEffect } from "react";
import { useFormikContext } from "formik";

const AutoBidStartPrice = () => {
  const { values, setFieldValue } = useFormikContext<any>();
  useEffect(() => {
    if (values.buyNowPrice) {
      const buyNow = Number(values.buyNowPrice);

      if (!isNaN(buyNow)) {
        const bidStart = Math.floor(buyNow * 0.9); // ✅ 10% less
        setFieldValue("bidStartPrice", bidStart);
      }
    } else {
      setFieldValue("bidStartPrice", "");
    }
  }, [values.buyNowPrice, setFieldValue]);

  return null;
};

export default AutoBidStartPrice;
