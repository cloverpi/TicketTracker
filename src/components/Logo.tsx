import { useState } from "react";

interface Props {
    grey?: boolean,
    noTitle?: boolean,
    transparent?: boolean,
    allowAnimate?: boolean,
}

function Logo({grey, noTitle, transparent, allowAnimate}: Props) {
    const [spin, setSpin] = useState(false);
    return (
        <div className={`${grey && 'greyscale'} ${transparent && 'opacity-50'}`}>   
        <div
        className="container-fluid d-flex justify-content-center"
        style={{ width: "50%" }}
        >
        <div style={{ position: "relative" }}>
            <img
            className={`${allowAnimate && spin ? "spin-slow" : ""}`}
            src="/lifering.svg"
            style={{ position: "relative", zIndex: 1, width: '140px' }}
            onMouseEnter={() => setSpin(true)}
            onMouseLeave={() => setSpin(false)}
            />

            <img
            src="/wave-min-left.svg"
            style={{
                position: "absolute",
                width: '210px',
                top: 22,
                left: -39,
                zIndex: 2,
                opacity: '98%',
                pointerEvents: "auto"
            }}
            onMouseEnter={() => setSpin(true)}
            onMouseLeave={() => setSpin(false)}
            />
        </div>
        </div>
            { !noTitle &&<>
            <br />
            <div className="container-fluid justify-content-center d-flex" style={{ width: "50%" }}>
                <h1 className="title">Chase Support</h1>
            </div>
            </>
            }
        </div>
    );
}

export default Logo;
