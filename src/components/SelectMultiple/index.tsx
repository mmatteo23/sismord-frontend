import React from "react";
import Select, { components, ValueContainerProps } from "react-select";
import { IServerOption } from "../../routes/Servers";

const ValueContainer = ({
  children,
  ...props
}: ValueContainerProps<IServerOption>) => {
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
        values =
          '"' + values.map((v: any) => v.props.children).join('", "') + '"';
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
  selected: IServerOption[];
  options: IServerOption[];
  setSelected: React.Dispatch<React.SetStateAction<IServerOption[]>>;
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
      required={true}
    />
  );
};

export default SelectMultiple;
