import { useEffect, useRef, useState } from "react";
import { AiOutlinePlayCircle, AiOutlineStop, AiOutlineRobot, AiOutlineVideoCamera } from "react-icons/ai";
import { predictBlob } from "../services/predict";
import html2canvas from "html2canvas"

export const VideoFrame = () => {
    const videoRef = useRef(0);
    const [state, setState] = useState({
        started: false,
        label: "",
        score: "",
        val: null,
        emoji: [
            ["😡", "😠", "🤬", "😤"],
            ["🤢", "🤮", "😒", "😏"],
            ["😬", "😵", "😨", "😬", "🥶"],
            ["😆", "😉", "😃", "😀", "😁", "😜", "🤪"],
            ["🙂", "😐"],
            ["😓", "😔", "🙁", "☹️", "😕", "😒", "😪", "😥", "😞", "😢"],
            ["🤯", "😱"]
        ],
        loading: false,
        randomIndex: null,
        processing: false,
        realTime: false,
    })

    const handleState = (name, val) => {
        setState(prevState => ({
            ...prevState,
            [name]: val
        }))
    }

    const compatible = () => {
        if (!window.navigator.mediaDevices()) {
            alert("Browser not compatible");
            return false;
        } else {
            return true;
        }
    }

    const start = async () => {
        if (compatible) {
            await window?.navigator?.mediaDevices.getUserMedia({
                video: true,
                audio: false,
            }).then(stream => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                handleState("started", true);
                return stream;
            });
        }
    }

    const stop = () => {
        videoRef.current.pause();
        handleState("started", false);
    }

    const predict = async () => {
        handleState("loading", true)
        const canvas = html2canvas(videoRef.current);
        const image = (await canvas).toDataURL("image/jpeg", 1.0)
        // console.log(image)
        await predictBlob(image).then(res => {
//             console.log(res.data);
            handleState("label", res.data.label);
            handleState("score", res.data.score)
            handleState("val", res.data.val);
            handleState("randomIndex", Math.floor(Math.random() * state.emoji[res.data.val].length))
            handleState("loading", false)
        }).catch(() => {
            handleState("loading", false)

        })

    }


    const startRealTime = async () => {
        handleState("realTime", true);
        var time = setInterval(predict)
        clearInterval(time);
    }

    const stopRealTime = async () => {
        handleState("realTime", false)
    }

    const snap = async () => {
        handleState("processing", true)
        const canvas = html2canvas(videoRef.current);
        const image = (await canvas).toDataURL("image/jpeg", 1.0)
        const a = document.createElement("a");
        a.href = image;
        a.download = "capture" + Date.now() + ".jpeg";
        a.click();
        handleState("processing", false)

    }


    return <div className="video-frame">
        <div className="video">
            <video controls={false} ref={videoRef}></video>
            <div className="space"></div>

            {(state.label !== "" && !state.loading) && <>
                <div className={`overlay`}>
                    <span className="emoji">{state.emoji[state.val][state.randomIndex]}</span>
                    {state.label} - {parseFloat(state.score).toFixed(2) * 100}%
                </div>
            </>}

        </div>
        <div className="space"></div>

        <div className="controls">
            {!state.started ? <button className="start" onClick={start}>
                <p>Start</p>
                <AiOutlinePlayCircle className="icon" />
            </button> : <button className="stop" onClick={stop}>
                <p>Stop</p>
                <AiOutlineStop className="icon" />
            </button>}

            {state.loading ? <button className="predict" onClick={predict} disabled={true}>
                <p>Analysing</p>
                <div className="loader"></div>
            </button> : <button className="predict" onClick={predict} disabled={!state.started}>
                <p>Analyse</p>
                <AiOutlineRobot className="icon" />
            </button>}

            {state.realTime ? <button className="predict" onClick={stopRealTime} disabled={false}>
                <p>Stop</p>
                <div className="loader"></div>
            </button> : <button className="predict" onClick={startRealTime} disabled={!state.started}>
                <p>Real Time</p>
                <AiOutlineRobot className="icon" />
            </button>}

            {state.processing ? <button className="snap" onClick={snap} disabled={true}>
                <p>Processing ...</p>
                <div className="loader"></div>
            </button> : <button className="snap" onClick={snap} disabled={!state.started}>
                <p>Download</p>
                <AiOutlineVideoCamera className="icon" />
            </button>}

        </div>
    </div>
}
