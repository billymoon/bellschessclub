"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useState } from "react";

export function ComboboxBasic({ items, setValue, name, ...props }) {
  const [freshItem, setFreshItem] = useState(null);
  const [allItems, setAllItems] = useState(items);

  return (
    <Combobox
      items={freshItem ? [...allItems, freshItem] : allItems}
      onInputValueChange={(value) => {
        if (value !== freshItem) {
          setFreshItem(!allItems.includes(value) ? value : null);
        }
      }}
      onValueChange={(value) => {
        if (!allItems.includes(value)) {
          setAllItems([value, ...items]);
        }
        setFreshItem(null);
        setValue(name, value);
      }}
      {...props}
    >
      <ComboboxInput name={name} />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {!allItems.includes(item) ? `Add "${item}"` : item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
