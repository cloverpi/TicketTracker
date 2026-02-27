import Logo from "./Logo";

interface Props {
  opacity?: number;
  text?: string;
}

function HintBox({ opacity = 100, text = '' }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: opacity / 100,
        pointerEvents: "none",
        zIndex: 1050
      }}
    >
      <div className="border-0">
        <Logo noTitle grey allowAnimate />
        <br />
        <br />
        <h5>{text}</h5>
      </div>
      
    </div>
  );
}

export default HintBox;