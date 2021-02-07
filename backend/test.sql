create table photos(
	user varchar(15),
	image varchar(400)
)
create table users(
	name varchar(15),
	password varchar(15)
)
  select * from users where name='test';

select * from photos where user='test' and chosen='1';