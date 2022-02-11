import { createConnection } from 'typeorm';
import { Author } from './../entity/Author';
import { Book } from './../entity/Book';
import { Category } from './../entity/Category';
import { Customer } from './../entity/Customer';
import { Purchase } from '../entity/Purchase';
import { Publisher } from './../entity/Publisher';
import { Review } from './../entity/Review';
import { SubOrder } from './../entity/SubOrder';
import { Users } from './../entity/Users';

export const initDatabaseConnection = async () => {
    try {
        await createConnection({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'haslo123',
            database: 'bookstore',
            entities: [Author, Book, Category, Customer, Purchase, Publisher, Review, SubOrder, Users],
            synchronize: true,
            logging: true
        });
        console.log('Połączono z bazą danych.');
    } catch (error) {
        console.error(error);
        throw new Error('Błąd podczas łączenia z bazą danych.');
    }
};
