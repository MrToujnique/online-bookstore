import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import { createBook } from "./../actions/bookActions";
import { listAuthors } from "../actions/authorActions";

export const ProductCreatePage = (props) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [pages, setPages] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [publisher, setPublisher] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [selectedId, setSelectedId] = useState(0);
  const [authorFirstName, setAuthorFirstName] = useState("");
  const [authorLastName, setAuthorLastName] = useState("");
  const [authors, setAuthors] = useState([]);

  const dispatch = useDispatch();

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const bookCreate = useSelector((state) => state.bookCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    book: createdBook,
  } = bookCreate;

  const authorList = useSelector((state) => state.authorList);
  const { loadingAuthors, errorAuthors, authorsAPI } = authorList;

  useEffect(() => {
    setTimeout(() => {
      dispatch(
        listAuthors({
          firstName: authorFirstName !== "" ? authorFirstName : "",
          lastName: authorLastName !== "" ? authorLastName : "",
        })
      );
    }, 100);
  }, [authorFirstName, authorLastName, dispatch]);

  const firstNameOnChangeHandler = (e) => {
    setAuthorFirstName(e.target.value);
  };

  const lastNameOnChangeHandler = (e) => {
    setAuthorLastName(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (authors.length > 0) {
      dispatch(
        createBook({
          title,
          pages,
          price,
          photo: image,
          category,
          publisher: publisher,
          authors,
          countinstock: countInStock,
          description,
          keywords,
        })
      );
      props.history.push(`/productlist`);
    } else {
      alert("Lista autor??w jest pusta!");
    }
  };

  const addAuthor = (e) => {
    e.preventDefault();
    let doesAuthorExist = false;
    if (authors.length > 0) {
      doesAuthorExist = authors.some(
        (item) =>
          item.firstName + item.lastName === authorFirstName + authorLastName
      );
    }
    if (
      (authorFirstName !== "" || authorLastName !== "") &&
      doesAuthorExist === false
    ) {
      setAuthors([
        ...authors,
        {
          id: selectedId,
          firstName: authorFirstName,
          lastName: authorLastName,
        },
      ]);
    } else if (doesAuthorExist === true) {
      alert("Taki autor ju?? istnieje na li??cie!");
    } else if (authorFirstName === "" && authorLastName === "") {
      alert("Uzupe??nij pole z autorem!");
    }
  };

  const deleteAuthor = (e, id) => {
    e.preventDefault();
    setAuthors(authors.filter((author) => author !== id));
  };

  return (
    <div>
      <div className="form">
        <form onSubmit={addAuthor}>
          <label htmlFor="authors">
            <h2>Autorzy</h2>
          </label>
          {
            <ul>
              {authors.length > 0 ? (
                authors.map((author, id) => (
                  <li>
                    ID: {author.id} <br />
                    Imi??: {author.firstName} <br />
                    Nazwisko: {author.lastName}
                    <button onClick={(e) => deleteAuthor(e, author)}>
                      Usu??
                    </button>
                  </li>
                ))
              ) : (
                <p>Lista autor??w jest pusta.</p>
              )}
              <br />
            </ul>
          }
          <input
            id="authorFirstName"
            type="text"
            placeholder="Imi?? autora"
            value={authorFirstName || ""}
            pattern="^[A-Za-z???????????????????????????????????? .'-]{2,30}"
            title="Imi?? autora powinno mie??ci?? si?? w przedziale od 2 do 30 znak??w, mo??e zawiera?? spacje oraz znaki .'-"
            onChange={(e) => {
              firstNameOnChangeHandler(e);
            }}
          ></input>
          <input
            id="authorLastName"
            type="text"
            placeholder="Nazwisko autora"
            value={authorLastName || ""}
            pattern="^[A-Za-z???????????????????????????????????? .'-]{2,30}"
            title="Nazwisko autora powinno mie??ci?? si?? w przedziale od 2 do 30 znak??w, mo??e zawiera?? spacje oraz znaki .'-"
            onChange={(e) => {
              lastNameOnChangeHandler(e);
            }}
          ></input>
          <button className="primary" type="submit">
            Dodaj
          </button>
          <div>
            {loadingAuthors ? (
              <CircularProgress />
            ) : errorAuthors ? (
              <div>{errorAuthors}</div>
            ) : (
              <>
                {authorsAPI.length !== 0 &&
                  (authorFirstName !== "" || authorLastName !== "") && (
                    <div className="dataResult">
                      {authorsAPI.map((value, key) => {
                        return (
                          <p
                            onClick={() => {
                              setSelectedId(value.id);
                              setAuthorFirstName(value.first_name);
                              setAuthorLastName(value.last_name);
                            }}
                          >
                            ID:{" "}
                            {value.id +
                              " " +
                              value.first_name +
                              " " +
                              value.last_name}{" "}
                          </p>
                        );
                      })}
                    </div>
                  )}
              </>
            )}
          </div>
        </form>
      </div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Dodawanie produktu</h1>
        </div>
        {loadingCreate && <CircularProgress></CircularProgress>}
        {errorCreate && <div variant="danger">{errorCreate}</div>}
        <>
          <div>
            <label htmlFor="title">Tytu??</label>
            <input
              id="title"
              type="text"
              placeholder="Wprowad?? tytu??"
              value={title || ""}
              onChange={(e) => setTitle(e.target.value)}
              pattern="^[\s\S]{2,99}"
              title="Tytu?? powinien mie??ci?? si?? w zakresie od 2 do 99 znak??w."
              required
              maxLength={99}
            ></input>
          </div>
          <div>
            <label htmlFor="price">Cena</label>
            <input
              id="price"
              type="text"
              placeholder="Wprowad?? cen??"
              value={price || ""}
              onChange={(e) => setPrice(e.target.value)}
              pattern="^\d+\.?\d{0,2}"
              title="Cena powinna by?? liczb?? ca??kowit?? lub zawiera?? do 2 cyfr po przecinku."
              required
              maxLength={9}
            ></input>
          </div>
          <div>
            <label htmlFor="pages">Liczba stron</label>
            <input
              id="pages"
              type="text"
              placeholder="Wprowad?? liczb?? stron"
              value={pages || ""}
              onChange={(e) => setPages(e.target.value)}
              pattern="^\d+"
              title="Liczba stron powinna by?? liczb?? ca??kowit??."
              required
              maxLength={5}
            ></input>
          </div>
          <div>
            <label htmlFor="avatar">Zdj??cie</label>
            <input
              id="avatar"
              type="text"
              placeholder="Wprowad?? link do zdj??cia"
              maxLength={500}
              title="Link mo??e mie?? maksymalnie 500 znak??w."
              value={image}
              onChange={(e) => setImage(e.target.value)}
            ></input>
          </div>
          <div>
            <label htmlFor="category">Kategoria</label>
            <input
              id="category"
              type="text"
              placeholder="Wprowad?? kategori??"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              pattern="^[\s\S]{2,60}"
              title="Nazwa kategorii musi mie??ci?? si?? w przedziale od 2 do 60 znak??w."
              required
              maxLength={60}
            ></input>
          </div>
          <div>
            <label htmlFor="publisher">Wydawnictwo</label>
            <input
              id="publisher"
              type="text"
              placeholder="Wprowad?? wydawnictwo"
              value={publisher || ""}
              onChange={(e) => setPublisher(e.target.value)}
              pattern="^[\s\S]{2,60}"
              title="Nazwa wydawnictwa musi mie??ci?? si?? w przedziale od 2 do 60 znak??w."
              required
              maxLength={60}
            ></input>
          </div>
          <div>
            <label htmlFor="countInStock">Liczba sztuk</label>
            <input
              id="countInStock"
              type="text"
              placeholder="Wprowad?? liczb?? sztuk"
              value={countInStock || ""}
              title="Liczba sztuk musi by?? liczb?? ca??kowit??."
              pattern="^\d+"
              required
              maxLength={6}
              onChange={(e) => setCountInStock(e.target.value)}
            ></input>
          </div>
          <div>
            <label htmlFor="description">Opis</label>
            <input
              id="description"
              rows="3"
              type="text"
              placeholder="Wprowad?? opis"
              value={description || ""}
              pattern="^[\s\S]{2,999}"
              title="Opis musi zawiera?? od 2 do 999 znak??w."
              required
              maxLength={999}
              onChange={(e) => setDescription(e.target.value)}
            ></input>
          </div>
          <div>
            <label htmlFor="keywords">S??owa kluczowe</label>
            <input
              id="keywords"
              rows="5"
              type="text"
              placeholder="Wprowad?? s??owa kluczowe"
              value={keywords || ""}
              pattern="^[\s\S]{2,999}"
              title="To pole musi zawiera?? od 2 do 999 znak??w."
              required
              maxLength={999}
              onChange={(e) => setKeywords(e.target.value)}
            ></input>
          </div>
          <div>
            <button className="primary" type="submit">
              Dodaj
            </button>
          </div>
        </>
      </form>
    </div>
  );
};
