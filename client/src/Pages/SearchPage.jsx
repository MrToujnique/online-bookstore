import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { listBooks } from "./../actions/bookActions";
import { CircularProgress } from "@mui/material";
import { Book } from "../Components/Book";
import { ArrowForwardIos } from "@mui/icons-material";

export const SearchPage = (props) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [publisherInput, setPublisherInput] = useState("");
  const {
    title = "all",
    category = "all",
    publisher = "all",
    min = 0,
    max = 0,
    order = "newest",
    pageNumber = 1,
  } = useParams();
  const dispatch = useDispatch();
  const bookList = useSelector((state) => state.bookList);
  const { loading, error, books, page, pages } = bookList;
  const bookCategoryList = useSelector((state) => state.bookCategoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = bookCategoryList;

  useEffect(() => {
    dispatch(
      listBooks({
        pageNumber,
        title: title !== "all" ? title : "",
        category: category !== "all" ? category : "",
        publisher: publisher !== "all" ? publisher : "",
        min,
        max,
        order,
      })
    );
  }, [category, dispatch, title, publisher, min, max, pageNumber, order]);

  const getFilterUrl = (filter) => {
    const filterCategory = filter.category || category;
    const filterPage = filter.page || pageNumber;
    const filterTitle = filter.title || title;
    const filterPublisher = filter.publisher || publisher;
    const sortOrder = filter.order || order;
    const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
    const filterMax = filter.max ? filter.max : filter.max === 0 ? 0 : max;
    return `/search/category/${filterCategory}/title/${filterTitle}/publisher/${filterPublisher}/minPrice/${filterMin}/maxPrice/${filterMax}/order/${sortOrder}/pageNumber/${filterPage}`;
  };

  return (
    <div>
      <div className="row top">
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div>{books.length} Wyników</div>
        )}
        <div>
          Sortuj przez{" "}
          <select
            value={order}
            onChange={(e) => {
              props.history.push(getFilterUrl({ order: e.target.value }));
            }}
          >
            <option value="newest">Najnowsze produkty</option>
            <option value="oldest">Najstarsze produkty</option>
            <option value="cheapest">Cena rosnąco</option>
            <option value="mostExpensive">Cena malejąco</option>
          </select>
        </div>
      </div>
      <div className="row">
        <div className="col-1">
          <h3>Kategorie</h3>
          <div>
            {loadingCategories ? (
              <CircularProgress />
            ) : errorCategories ? (
              <div>{errorCategories}</div>
            ) : (
              <>
                <ul>
                  <li>
                    <Link
                      className={"all" === category ? "active" : ""}
                      to={getFilterUrl({ category: "all" })}
                    >
                      Wszystkie
                    </Link>
                  </li>
                  {categories.map((c) => (
                    <li key={c.id}>
                      <Link
                        className={c === category ? "active" : ""}
                        to={getFilterUrl({ category: c.name })}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div>
            <h3>Cena</h3>
            <div className="priceInputs">
              <form>
                <input
                  type="number"
                  placeholder="Od (zł)"
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                {minPrice ? (
                  <Link to={getFilterUrl({ min: minPrice })}>
                    <button>
                      <ArrowForwardIos />
                    </button>
                  </Link>
                ) : (
                  <div />
                )}
              </form>
              <form>
                <input
                  type="number"
                  placeholder="Do (zł)"
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
                {maxPrice ? (
                  <Link to={getFilterUrl({ max: maxPrice })}>
                    <button>
                      <ArrowForwardIos />
                    </button>
                  </Link>
                ) : (
                  <div />
                )}
              </form>
            </div>
          </div>
          <div>
            <h3>Wydawnictwo</h3>
            <div className="priceInputs">
              <form>
                <input
                  type="text"
                  placeholder="Nazwa wydawnictwa"
                  onChange={(e) => setPublisherInput(e.target.value)}
                />
                {publisherInput ? (
                  <Link to={getFilterUrl({ publisher: publisherInput })}>
                    <button>
                      <ArrowForwardIos />
                    </button>
                  </Link>
                ) : (
                  <div />
                )}
              </form>
            </div>
          </div>
        </div>
        <div className="col-3">
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <div>{error}</div>
          ) : (
            <>
              {books.length === 0 && (
                <div>
                  Nie znaleziono żadnego produktu spełniającego kryteria
                </div>
              )}
              <div className="row center">
                {books.map((book) => (
                  <Book key={book.id} book={book}></Book>
                ))}
              </div>
              <div className="row center pagination">
                {[...Array(pages).keys()].map((x) => (
                  <Link
                    className={x + 1 === page ? "active" : ""}
                    key={x + 1}
                    to={getFilterUrl({ page: x + 1 })}
                  >
                    {x + 1}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
