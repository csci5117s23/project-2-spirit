import Webcam from "react-webcam";
import { React, useEffect, useState } from "react";
import {Html5QrcodeScanner} from "html5-qrcode";

// https://scanapp.org/html5-qrcode-docs/docs/intro

export default function Scan() {
    const [content, changeContent] = useState("Nothing scanned yet");

    useEffect(() => {
        function onScanSuccess(decodedText, decodedResult) {
            // handle the scanned code as you like, for example:
            changeContent(decodedText);
        }
        
        function onScanFailure(error) {
        // handle scan failure, usually better to ignore and keep scanning.
        // for example:
        console.warn(`Code scan error = ${error}`);
        }
          
        let html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: {width: 250, height: 250} },
        /* verbose= */ false);
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    }, [])

    return (<>
        <div id="reader" style={{width: "600px"}}></div>
        <p>{content}</p>
    </>);
}