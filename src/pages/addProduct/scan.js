import Webcam from "react-webcam";

// https://www.npmjs.com/package/react-webcam

export default function Scan() {
    
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
        </Webcam>
    );
}