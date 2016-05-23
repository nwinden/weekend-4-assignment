--Call to make the table of lists

CREATE TABLE tasks (
    id serial PRIMARY KEY,
    task varchar(120),
    completed boolean);
