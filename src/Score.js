import React, {useEffect, useRef, useState} from 'react';
import VexFlow from 'vexflow';

const VF = VexFlow.Flow;
const {Formatter, Renderer, Stave, StaveNote} = VF;

const clefAndTimeWidth = 60;

const staveData = [
    ['g3', 'd4', 'e4', 'd4'],
    ['a4', 'd4', 'e4', 'd4'],
    ['a4', 'a4', 'b4', 'a4'],
    ['d4', 'e4', ['g3', 2]],
];

export function Score({
                          staves = staveData,
                          clef = 'treble',
                          timeSignature = '4/4',
                          width = 450,
                          height = 150,
                      }) {

    // Declare a new state variable, which we'll call "count"
    // const [count, setCount] = useState(0);
    const [notes, setNotes] = useState(staveData);

    const container = useRef();
    const rendererRef = useRef();

    useEffect(parseNotes, [staves]);

    function parseNotes() {

        // if (rendererRef.current == null) {
            rendererRef.current = new Renderer(
                container.current,
                Renderer.Backends.SVG
            )
        // }
        const renderer = rendererRef.current;
        renderer.resize(width, height);
        const context = renderer.getContext();
        context.setFont('Arial', 10, '').setBackgroundFillStyle('#eed');
        const staveWidth = (width - clefAndTimeWidth) / staves.length;

        let currX = 0;
        console.log("refreshing " + staves.length + " staves.");

        staves.forEach((notes, i) => {
            const stave = new Stave(currX, 0, staveWidth);
            if (i === 0) {
                stave.setWidth(staveWidth + clefAndTimeWidth);
                stave.addClef(clef).addTimeSignature(timeSignature)
            }
            currX += stave.getWidth();
            stave.setContext(context).draw();

            const processedNotes = notes
                .map(note => (typeof note === 'string' ? {key: note} : note))
                .map(note =>
                    Array.isArray(note) ? {key: note[0], duration: note[1]} : note
                )
                .map(({key, ...rest}) =>
                    typeof key === 'string'
                        ? {
                            key: key.includes('/') ? key : `${key[0]}/${key.slice(1)}`,
                            ...rest,
                        }
                        : rest
                )
                .map(
                    ({key, keys, duration = 'q'}) =>
                        new StaveNote({
                            keys: key ? [key] : keys,
                            duration: String(duration),
                        })
                );
            Formatter.FormatAndDraw(context, stave, processedNotes, {
                auto_beam: true,
            })
        })
    }

    return (
        <div>
            <div ref={container}/>
            <p>You played these {notes}</p>
            <button onClick={setNotesMM}>
                Click me
            </button>
        </div>);

    function setNotesMM() {
        staveData.push([["A4"], ["A4"], ["A4"], ["A4"]]);
        console.log(staveData);
        parseNotes();
        return setNotes(staveData);

    }
}

export default Score;