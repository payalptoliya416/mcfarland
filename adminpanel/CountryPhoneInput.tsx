import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type PhoneFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export function CountryPhoneInput({ value, onChange }: PhoneFieldProps) {
  return (
    <PhoneInput
      country="in"
      value={value}
      onChange={onChange}
      enableSearch
      countryCodeEditable={false}

      /* MAIN CONTAINER */
      containerClass="!w-full"

      /* INPUT FIELD */
      inputClass="
        !w-full
        !h-[56px]
        !pl-[60px]
        !pr-5
        !rounded-[10px]
        !border
        !border-border
        !text-sm
        focus:!outline-none
      "

      /* FLAG BUTTON */
      buttonClass="
        !border
        !border-border
        !rounded-l-[10px]
        !h-[56px]
        !w-[52px]
        !flex
        !items-center
        !justify-center
      "

      dropdownClass="!text-sm"
      placeholder="(000) 000-0000"
    />
  );
}

