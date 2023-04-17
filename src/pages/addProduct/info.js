import { useEffect, useState } from "react";

export default function Info() {
    const [imgSrc, setImg] = useState(null);

    useEffect(() => {
        const src = localStorage.getItem("productImage");
        if(src) {
            setImg(src);
        }
    })

    return(<>
        <img src={imgSrc} />
    </>)
}