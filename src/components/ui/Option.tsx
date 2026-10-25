import type { OptionHTMLAttributes } from "react";

type OptionProps = OptionHTMLAttributes<HTMLOptionElement>;

export default function Option({children,...props}:OptionProps){
    return(
        <option {...props}>
            {children}
        </option>
    )
}