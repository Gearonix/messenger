UPDATE rooms SET online = 0

alter table rooms add online TINYINT default 0

select online from rooms where room=;

alter table messages modify attached_images json

select JSON_ARRAY_APPEND(attached_images, '$', '4') AS 'Result';

UPDATE messages
SET attached_images = JSON_ARRAY_APPEND (attached_images, '$', '5') where sender='test' and room='test' ;

update messages set attached_images='[]';

insert messages(message,sender,room) values('hello','ez','test');
insert rooms(room) values('hello');

alter table rooms add id SMALLINT AUTO_INCREMENT PRIMARY KEY

select * from messages where sender='test' and room='test' order by id desc limit 1;

select * from messages where room='test' order by id desc limit 4;
insert messages(message,sender,room,image,attached_images) values('test','test','test',NULL,'[]')

alter table rooms add description varchar(40);
alter table rooms add image varchar(400);
alter table rooms add background varchar(400);
alter table messages add creation_time varchar(5);

update rooms set description = 'test_description';

select * from rooms where room='test';

update rooms set room='test',description='test_desc_2' where room='test';
update users set room='test_2' where room='test';
update rooms set room='test' where room='test_3';

update rooms set image='room_images/$room' where room='test';

select * from users where room='test'

delete from messages where id = '198';
