create table if not exists users (
    id serial primary key,
    name varchar(100) not null,
    email varchar(100) unique not null,
    password varchar(255) not null,
    refresh_token varchar(255)
);