
CREATE DATABASE syl DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

show variables like'%char%';
set character_set_database=utf8;
set character_set_server=utf8;
set character_set_client=utf8;
set character_set_connection=utf8;

use syl;


alter table cust_user AUTO_INCREMENT=100000;
