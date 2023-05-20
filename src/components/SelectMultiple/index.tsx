import React from "react";
import Select, { components, ValueContainerProps } from "react-select";
import { IClaim } from "../../routes/Servers";

const ValueContainer = ({
  children,
  ...props
}: ValueContainerProps<IClaim>) => {
  let [values, input] = children as any;

  if (Array.isArray(values)) {
    const val = (i: number) => values[i].props.children;
    const { length } = values;

    switch (length) {
      case 1:
        values = `"${val(0)}"`;
        break;
      case 2:
        values = `"${val(0)}", "${val(1)}"`;
        break;
      case 3:
        values = `"${val(0)}", "${val(1)}" and "${val(2)}"`;
        break;
      default:
        values = '\"'+values.map((v: any) => v.props.children).join("\", \"")+'\"';
        break;
    }
  }

  return (
    <components.ValueContainer {...props}>
      {values}
      {input}
    </components.ValueContainer>
  );
};

const SelectMultiple = (props: {
  options: IClaim[];
  selected: IClaim[];
  setSelected: React.Dispatch<React.SetStateAction<IClaim[]>>;
}): JSX.Element => {
  return (
    <Select
      value={props.selected}
      onChange={(s: any) => props.setSelected(s)}
      options={props.options}
      isMulti
      isSearchable
      closeMenuOnSelect={false}
      hideSelectedOptions
      components={{
        ValueContainer,
      }}
    />
  );
};

export default SelectMultiple;
