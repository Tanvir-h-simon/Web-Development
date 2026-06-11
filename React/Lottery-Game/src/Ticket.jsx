import TicketNum from "./TicketNum";

export default function Ticket({ ticket }) {
  return (
    <div className="ticket">
      <h2>Your Ticket</h2>
      <div className="ticket-numbers">
        <TicketNum num={ticket[0]} />
        <TicketNum num={ticket[1]} />
        <TicketNum num={ticket[2]} />
      </div>
    </div>
  );
}
