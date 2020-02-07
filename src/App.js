import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as WebMidi from "webmidi";
import Score from "./Score";

function App() {

    WebMidi.enable(function (err) {

        if (err) {
            console.log("WebMidi could not be enabled.", err);
        } else {
            console.log("WebMidi enabled!");
            console.log(WebMidi.inputs);
            console.log(WebMidi.outputs);

            // Retrieve an input by name, id or index
            // let input = WebMidi.getInputByName("circuit");
            let input = WebMidi.inputs[0];

            // Listen for a 'note on' message on all channels
            input.addListener('noteon', "all",
                function (e) {
                    console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
                }
            );

            // Listen for a 'note on' message on all channels
            // input.addListener('noteoff', "all",
            //     function (e) {
            //         console.log("Received 'noteoff' message (" + e.note.name + e.note.octave + ").");
            //     }
            // );

            // Listen to pitch bend message on channel 3
            input.addListener('pitchbend', 3,
                function (e) {
                    console.log("Received 'pitchbend' message.", e);
                }
            );

            // Listen to control change message on all channels
            input.addListener('controlchange', "all",
                function (e) {
                    console.log("Received 'controlchange' message.", e);
                }
            );

        }

    });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Score/>
      </header>

    </div>
  );
}

export default App;
