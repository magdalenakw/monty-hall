import React, { useId } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: SelectOption[];
  label: string;
};

const Select = ({ options, label, ...rest }: SelectProps) => {
  const id = useId();

  return (
    <label className="autoplay__label" htmlFor={id}>
      {label}
      <div
        style={{
          position: "relative",
          display: "inline-block",
        }}
      >
        <select
          id={id}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            paddingRight: "2rem",
          }}
          {...rest}
        >
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <FontAwesomeIcon
          icon={faChevronDown}
          style={{
            position: "absolute",
            right: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </label>
  );
};

export default Select;
