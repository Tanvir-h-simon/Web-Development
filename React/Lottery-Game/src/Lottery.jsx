import { useState } from "react";
import "./Lottery.css";
import { getRandomNumber, sum } from "./helper";
import Ticket from "./Ticket";

export default function Lottery() {
  let [ticket, setTicket] = useState(getRandomNumber(3));
  let isWinning = sum(ticket) === 15;

  let buyNewTicket = () => {
    setTicket(getRandomNumber(3));
  };

  return (
    <div className="lottery">
      <h1>Lottery Game</h1>
      <Ticket ticket={ticket} />
      <button onClick={buyNewTicket}>Buy New Ticket</button>
      {isWinning && <p className="win-message">You Won! 🎉</p>}
    </div>
  );
}
