import Webcam from "react-webcam";
import { React, useEffect, useState } from "react";
import {Html5Qrcode} from "html5-qrcode";

// https://scanapp.org/html5-qrcode-docs/docs/intro

export default function Scan() {
    const [devicesArray, changeDevices] = useState([]);
    const [cameraId, changeCamera] = useState(null);
    const [content, changeContent] = useState(null);
    const [responseValue, setResponse] = useState(null);
    const [width, setWidth] = useState(600);

    useEffect(() => {
        Html5Qrcode.getCameras().then(devices => {
            /**
             * devices would be an array of objects of type:
             * { id: "id", label: "label" }
             */
            if (devices && devices.length) {
                changeDevices(devices);
                changeCamera(devices[0].id);
                // .. use this to start scanning.
            }
          }).catch(err => {
            // handle err
          });        
        setWidth(window.innerWidth);
    }, [])

    if(cameraId) {
        const html5QrCode = new Html5Qrcode(/* element id */ "reader");
        html5QrCode.start(
        cameraId, 
        {
            fps: 10,    // Optional, frame per seconds for qr code scanning
            qrbox: { width: 200, height: 200 }  // Optional, if you want bounded box UI
        },
        (decodedText, decodedResult) => {
            // do something when code is read
            changeContent(decodedText);
            html5QrCode.stop().then((ignore) => {
                // QR Code scanning is stopped.
            }).catch((err) => {
                // Stop failed, handle it.
            });
        },
        (errorMessage) => {
            // parse error, ignore it.
        })
        .catch((err) => {
        // Start failed, handle it.
        });  
    }

    const fetchData = async () => {
        const response = await fetch("https://project2-hxgl.api.codehooks.io/dev/scan?content=" + content, {
            "method" : "GET",
            "headers": {"x-apikey": process.env.NEXT_PUBLIC_API_KEY}
        });
        // setResponse(response);
        const data = await response.json();
        console.log(data.products[0]);
    };

    return (<>
        {!content && <>
            <div id="reader" style={{width: "100vw"}}></div>
            <select name="devices" id="devices" onChange={() => changeCamera(document.getElementById("devices").value)}>
                {Object.values(devicesArray).map(value => {
                    return <option key={value.label} value={value.id}>{value.label}</option>
                })}
            </select>
        </>}
        {content && <>
            <p>{content}</p>
            <button onClick={() => fetchData()}>Click to fetch</button>
        </>}
    </>);
}