import React from "react";
import "./Tickets.css";
//import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import ReactDOMServer from 'react-dom/server';
//import ReactPDF from '@react-pdf/renderer';
import { API_URL, request } from './apiconnection.js';

/*
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});
*/



class Tickets extends React.Component {
  constructor(props) {
    super(props);
  }


  makepdf(ticket) {

  }

/*sendEmail(tickets) {
    console.log("Heheh",tickets);
    //const htmlString = ReactDOMServer.renderToStaticMarkup(tickets);
    //console.log(htmlString);
    fetch(request(`${API_URL}sendtickets`, 'POST', { tickets: tickets }))
      .then(res => res.json())
      .then(result => {
        console.log(result);
      }).catch(error => Promise.reject(new Error(error))); 
  } */



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
            Download your ticket here <a href="">Download PDF</a>
          </p>
        </div>
      </div>
    );
  }
}

export default Tickets;
