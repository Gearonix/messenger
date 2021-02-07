UPDATE rooms SET online = 0

alter table rooms add online TINYINT default 0

select online from rooms where room=;