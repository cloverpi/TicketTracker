import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/react";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
  content: React.ReactNode;
}

function Popover({ children, content }: Props) {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles } = useFloating({
    open,
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 8 })
    ],
    whileElementsMounted: autoUpdate
  });

  return (
    <>
      <div
        ref={refs.setReference}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{ display: "inline-block" }}
      >
        {children}
      </div>

      {open && (
        <div
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            background: "#212529",
            color: "white",
            padding: "8px 12px",
            borderRadius: 6,
            fontSize: "1.2rem",
            lineHeight: 1.4,
            maxWidth: 300,
            whiteSpace: "normal",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            zIndex: 1000
          }}
        >
          {content}
        </div>
      )}
    </>
  );
}

export default Popover;