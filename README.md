# Yoga

## Project installation

### DB configuration

Initialize the database with the following script :

```sql
DROP DATABASE IF EXISTS `test`;

CREATE DATABASE `test`;

USE `test`;

CREATE TABLE `TEACHERS` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `last_name` VARCHAR(40),
  `first_name` VARCHAR(40),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `SESSIONS` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50),
  `description` VARCHAR(2000),
  `date` TIMESTAMP,
  `teacher_id` int,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `USERS` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `last_name` VARCHAR(40),
  `first_name` VARCHAR(40),
  `admin` BOOLEAN NOT NULL DEFAULT false,
  `email` VARCHAR(255),
  `password` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `PARTICIPATE` (
  `user_id` INT,
  `session_id` INT
);

ALTER TABLE `SESSIONS` ADD FOREIGN KEY (`teacher_id`) REFERENCES `TEACHERS` (`id`);
ALTER TABLE `PARTICIPATE` ADD FOREIGN KEY (`user_id`) REFERENCES `USERS` (`id`);
ALTER TABLE `PARTICIPATE` ADD FOREIGN KEY (`session_id`) REFERENCES `SESSIONS` (`id`);

INSERT INTO TEACHERS (first_name, last_name)
VALUES ('Margot', 'DELAHAYE'),
       ('Hélène', 'THIERCELIN');


INSERT INTO USERS (first_name, last_name, admin, email, password)
VALUES ('Admin', 'Admin', true, 'yoga@studio.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq');

```

(you can also found the script on `ressources/sql/script.sql`)

### Clone project and install dependancies

#### Clone

In your IDE, git clone the project with :

```
https://github.com/casspuisset/Testez-une-application-full-stack.git
```

#### Frontend

Install npm in the frontend folder :

```
cd yoga/front
npm install
```

#### Backend

Install maven in the backend folder :

```
cd ../back
mvn install
```

## Utilisation

### Without testing

To use yoga application outside testing, run your backend then `npm run start` in your frontend folder. Your backend is running on http://localhost:8080/ and your frontend on http://localhost:4200/.

A user already exist in your DB with admin status :

- login: yoga@studio.com
- password: test!1234

### Testing

To run your tests, you must be on the correct folder (`back` for backend, `front` for frontend and E2E)

#### Frontend

For launching test:

```
npm run test
```

for following change:

```
npm run test:watch
```

for generate coverage report:

```
npx jest --coverage
```

#### Backend

To run unit tests:

```
mvn test
```

To also run integration tests:

```
mvn verify
```

Coverage report will automatically be generate by jacopo.

#### End-to-End

To access cypress command dashboard for your tests

```
npm run e2e
```

Once your tests have been running, you can generate report with:

```
npm run e2e:coverage
```

### Coverage

You can acces to the coverage report of jacoco for your backend at:

> back/target/site/jacoco/index.html

Frontend and E2E tests coverage reports are on the front/coverage folder:
Frontend :

> front/coverage/jest/lcov-report/index.html

E2e :

> front/coverage/lcov-report/index.html
