The web application is a Flight Reservation System that allows users to search for flights, reserve seats on a flight, and view existing reservations. The app is built using React for the frontend and Node.js with Express for the backend. A local MySQL database is used to store the data tables outlined in the Schema document. The mysql2 npm library is used for CRUD operations.

## Key Features
### Flight Search and Reservation:

* Users can search for available flights.

* A DataTable is used to display flight information with features such as pagination, sorting, and searching.

* Users can reserve a seat on a flight by selecting an available flight and entering the necessary reservation details.

### Reservation Search:

* Users can search for existing reservations by entering a Customer ID.

* The search results are displayed in a DataTable.

### Error Checking:
* Error messages are displayed if the database cannot be reached,
* Reservations are checked for correct information and an error message is displayed if any information is incorrect.
* Reservations can only be made if the selected seat is not booked and given bank account has enough balance.

## [Demo Video](https://youtu.be/WWA5spOKyv0)
