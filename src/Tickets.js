import React from "react";
import "./css/Tickets.css";

class Tickets extends React.Component {
  makepdf(ticket) {

  }

  render() {
    console.log(this.props.tickets);
    console.log(this.props.lastOS);
    let tickets = [];
    let ticketsRend;
    if (this.props.tickets) {
      for (const seat of this.props.tickets.seats) {
        tickets.push({ seat: seat, showing: this.props.lastOS });
      }

      ticketsRend = tickets.map((ticket, index) => {
        return (
          <div key={index} className="ticket">
            <p>Movie: {ticket.showing.title}</p>{" "}
            <p>
              {ticket.showing.fullDate} {ticket.showing.date}
            </p>
            <p>
              Seat: {ticket.seat} Row: {Math.ceil(ticket.seat / 10)} Room:{" "}
              {ticket.showing.room}
            </p>
          </div>
        );
      });
    }


    return (
      <div id="tickets">
        {ticketsRend}
        <div id="confirmation">
          <p>Your tickets has been sent to your e-mail address!</p>
          <p>
            Download your ticket here <a href="\">Download PDF</a>
          </p>
        </div>
      </div>
    );
  }
}

export default Tickets;
