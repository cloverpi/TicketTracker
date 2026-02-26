import { useRef, useState, useEffect } from "react";

type ComboTextFieldProps = {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  widthPx?: number;
  maxMenuHeightPx?: number;
};

function ComboTextField({
  id,
  label,
  options,
  value,
  onChange,
  widthPx,
  maxMenuHeightPx = 240
}: ComboTextFieldProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  if (!open) return;

  const q = value.trim().toLowerCase();
  if (!q) {
    setActiveIndex(-1);
    return;
  }

  const matchIndex = options.findIndex((o) =>
    o.toLowerCase().includes(q)
  );

  setActiveIndex(matchIndex);
}, [value, open, options]);


  const close = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const pick = (v: string) => {
    onChange(v);
    close();
    inputRef.current?.focus();
  };

  const move = (dir: 1 | -1) => {
    if (options.length === 0) return;
    setOpen(true);
    setActiveIndex((i) => {
      const next = i < 0 ? (dir === 1 ? 0 : options.length - 1) : i + dir;
      if (next >= options.length) return 0;
      if (next < 0) return options.length - 1;
      return next;
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
      return;
    }
    if (e.key === "Enter") {
      if (open && activeIndex >= 0 && activeIndex < options.length) {
        e.preventDefault();
        pick(options[activeIndex]);
      }
      return;
    }
    if (e.key === "Tab") {
      if (open && activeIndex >= 0 && activeIndex < options.length) {
        pick(options[activeIndex]);
      }
      console.log(activeIndex)
      if (open && activeIndex == -1){
        e.preventDefault();
        pick(options[0]);
      }
      return;
    }
    if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        close();
      }
      return;
    }
  };

  return (
    <div
      className="form-floating position-relative mb-2"
      style={widthPx ? { width: `${widthPx}px` } : undefined}
    >
      <input
        ref={inputRef}
        id={id}
        className="form-control pe-5"
        placeholder={label}
        value={value}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => setTimeout(() => close(), 150)}
        autoComplete="off"
      />

      <label htmlFor={id}>{label}</label>

      <button
        type="button"
        tabIndex={-1}
        className="btn btn-outline-primary dropdown-toggle dropdown-toggle-split position-absolute top-0 end-0 h-100"
        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          setOpen((o) => !o);
          inputRef.current?.focus();
        }}
        aria-label="Toggle options"
      />

      {open && options.length > 0 && (
        <div
          className="dropdown-menu show w-100"
          style={{
            maxHeight: `${maxMenuHeightPx}px`,
            overflowY: "auto"
          }}
        >
          {options.map((opt, i) => (
            <button
              key={opt}
              type="button"
              className={"dropdown-item" + (i === activeIndex ? " active" : "")}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ComboTextField;
