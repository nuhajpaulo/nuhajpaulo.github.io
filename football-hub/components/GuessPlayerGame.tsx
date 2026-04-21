"use client";

import { useState } from "react";
import { players } from "@/lib/mockData";

export function GuessPlayerGame() {
  const [mysteryIndex, setMysteryIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const mystery = players[mysteryIndex];
  const correct = guess.trim().toLowerCase() === mystery.name.toLowerCase();

  const handleNewClue = () => {
    const nextIndex = Math.floor(Math.random() * players.length);
    setMysteryIndex(nextIndex);
    setGuess("");
    setSubmitted(false);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
      <h3 className="text-lg font-semibold">Guess the Player</h3>
      <p className="mt-2 text-sm text-zinc-300">{`Team: ${mystery.team} · Nationality: ${mystery.nationality} · Position: ${mystery.position}`}</p>
      <div className="mt-4 flex gap-2">
        <input
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Type player name"
          className="flex-1 rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm"
        />
        <button
          onClick={() => setSubmitted(true)}
          className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-black"
        >
          Guess
        </button>
        <button
          onClick={handleNewClue}
          className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
        >
          New clue
        </button>
      </div>
      {submitted && (
        <p className="mt-3 text-sm text-zinc-200">
          {correct ? "Correct! Great football knowledge." : `Not this time. Answer: ${mystery.name}`}
        </p>
      )}
    </div>
  );
}
