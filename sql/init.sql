create database if not exists sh_code_challenge;

use sh_code_challenge;

drop table if exists users;

create table users (
  id bigint unsigned not null auto_increment,
  name varchar(255) not null,
  type varchar(255) not null,
  primary key (id)
);

drop table if exists tasks;

create table tasks (
  id bigint unsigned  not null auto_increment,
  summary varchar(2500) not null,
  created_at timestamp,
  user_id bigint unsigned not null,
  primary key (id),
  foreign key (user_id) references users(id)
);