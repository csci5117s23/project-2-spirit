import Webcam from "react-webcam";
import { React, useState } from "react";

// https://www.npmjs.com/package/react-webcam

export default function Scan() {
    const [imgSrc, setImgSrc] = useState(null);
    
    const videoConstraints = {
        width: 400,
        height: 400,
        facingMode: "user",
    };

    return (
        <Webcam
            audio={false}
            width={400}
            height={400}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
        >
            {({ getScreenshot }) => (
            <button onClick={() => {
                setImgSrc(getScreenshot());
            }}>Capture</button>)}
            {/* {imgSrc && (
                <img src={imgSrc}/>
            )} */}
        </Webcam>
    );
}