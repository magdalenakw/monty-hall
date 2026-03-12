import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

const Input = ({ label, ...rest }: InputProps) => {
  return (
    <label className="autoplay__label">
      {label}
      <input {...rest} />
    </label>
  );
};

export default Input;
