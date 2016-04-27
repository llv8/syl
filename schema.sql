
CREATE DATABASE syl DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

show variables like'%char%';
set character_set_database=utf8;
set character_set_server=utf8;
set character_set_client=utf8;
set character_set_connection=utf8;

use syl;
create table cust(
 id int(10) not null primary key auto_increment,
 name varchar(20) not null,
 email varchar(100) not null,
 phone varchar(40) not null,
 state_id int(1) not null

)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table grp(
 id int(10) not null primary key auto_increment,
 name varchar(20) not null,
 state_id int(1) not null
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table grp_cust(
 id int(10) not null primary key auto_increment,
 grp_id int(10) not null,
 cust_id int(10) not null,
 state_id int(1) not null
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
