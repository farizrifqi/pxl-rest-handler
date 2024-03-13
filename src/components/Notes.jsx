"use client";

import { useEffect, useState } from "react";
export default function NotesComponent({ username }) {
  return <></>;
}
export function NotesComponentReal({ username }) {
  const [notes, setNotes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!loaded && typeof window !== "undefined" && window.localStorage) {
      getNotesFromStorage();
      setLoaded(true);
    }
  }, []);
  const saveNotes = (newNotes) => {
    try {
      const notesRaw = JSON.parse(localStorage.getItem("notes"));
      notesRaw[username] = [
        ...notes,
        {
          endTime: new Date().getTime() + 1000 * 60 * 60,
          time: new Date().getTime(),
          name: "Clover",
        },
      ];
      localStorage.setItem("notes", JSON.stringify(notesRaw));
      setNotes(notesRaw[username]);
    } catch (err) {}
  };
  const getNotesFromStorage = () => {
    try {
      const notesRaw = localStorage.getItem("notes");
      if (notesRaw) {
        const no = JSON.parse(notesRaw);
        const tempNotes = { ...no };
        setNotes(tempNotes[username] ? tempNotes[username] : notes);
      } else {
        localStorage.setItem("notes", JSON.stringify({}));
      }
    } catch (err) {
      console.log("failed getting notes");
    }
  };
  const addCloverNotes = () => {
    saveNotes({ time: new Date().getTime(), name: "Clover" });
  };
  return (
    <div className="flex flex-col text-xs">
      {notes.map((a, i) => (
        <div key={i}>
          {a.name} end: {a.time}
        </div>
      ))}
      <hr />
      <button
        onClick={addCloverNotes}
        className="bg-emerald-500 w-fit py-0.5 px-1 rounded-lg"
      >
        Clover
      </button>
    </div>
  );
}
