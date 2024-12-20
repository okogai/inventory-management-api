CREATE SCHEMA officeinventory_db COLLATE utf8mb3_general_ci;

USE officeinventory_db;

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    location_id INT NOT NULL,
    description TEXT,
    image VARCHAR(255),
    date_added DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Categories(id),
    FOREIGN KEY (location_id) REFERENCES Locations(id)
);

INSERT INTO Categories (name, description) VALUES
('Мебель', 'Столы, стулья, шкафы'),
('Компьютерное оборудование', 'Ноутбуки, мониторы, клавиатуры'),
('Бытовая техника', 'Кондиционеры, кофемашины, микроволновки');

INSERT INTO Locations (name, description) VALUES
('Кабинет 401', 'Кабинет директора'),
('Кабинет 254', 'IT-отдел'),
('Кабинет 321', 'Отдел маркетинга');

INSERT INTO Items (name, category_id, location_id, description, image) VALUES
('Кресло офисное', 1, 1, 'Кожанное', 'images/chair.jpg'),
('Ноутбук HP', 2, 2, 'ProBook', 'images/laptop.jpg'),
('Кондиционер LG', 3, 3, '30 м²', 'images/ac.jpg');
