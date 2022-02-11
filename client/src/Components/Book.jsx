import { Link } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";

export const Book = (props) => {
  const { book } = props;

  return (
    <Card key={book.book_id} className="card">
      <Link to={`/product/${book.book_id}`}>
        <img className="medium" src={book.book_photo} alt={book.book_title} />
      </Link>
      <CardContent>
        <div>
          <Typography variant="h5" gutterBottom>
            {book.book_title}
          </Typography>
          <Typography variant="body2">
            Cena: {Number(book.book_price).toFixed(2)} zł <br />
            Liczba stron: {book.book_pages} <br />
            Identyfikator produktu: {book.book_id} <br />
            Autorzy:{" "}
            {book.authors_full_names.length !== 0
              ? book.authors_full_names.map((item) => {
                  return item.first_name + " " + item.last_name + ", ";
                })
              : "Nieznani"}{" "}
            <br />
            Wydawnictwo: {book.publisher_name ? book.publisher_name : "Brak"}
            <br />
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};
