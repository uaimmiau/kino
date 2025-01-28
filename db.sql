create table if not exists movie
(
    id          serial
        constraint movie_pk
            primary key,
    title       varchar(200) not null,
    description varchar(2000),
    runtime     smallint,
    poster      bytea
);

alter table movie
    owner to postgres;

create table if not exists room
(
    id         serial
        constraint room_pk
            primary key,
    number     smallint    not null,
    sponsor    varchar(40) not null,
    technology varchar(3)
);

alter table room
    owner to postgres;

create table if not exists screening
(
    id           serial
        constraint screening_pk
            primary key,
    movie_id     integer   not null
        constraint screening_movie_id_fk
            references movie,
    room_id      integer   not null
        constraint screening_room_id_fk
            references room,
    start_date   timestamp not null,
    normal_price numeric,
    vip_price    numeric
);

alter table screening
    owner to postgres;

create trigger check_screening_overlap
    before insert
    on screening
    for each row
execute procedure public.validate_screening_overlap();

create table if not exists seat
(
    id        serial
        constraint seat_pk
            primary key,
    room_id   integer  not null
        constraint seat_room_id_fk
            references room,
    dim_x     smallint not null,
    dim_y     smallint not null,
    row       smallint not null,
    number    smallint not null,
    seat_type integer  not null
);

alter table seat
    owner to postgres;

create table if not exists "user"
(
    id            serial
        constraint user_pk
            primary key,
    username      varchar(80)           not null,
    name          varchar(80),
    surname       varchar(80),
    email         varchar(80)           not null,
    salt          varchar(128)          not null,
    password_hash varchar(256)          not null,
    admin         boolean default false not null
);

alter table "user"
    owner to postgres;

create table if not exists reservation
(
    id           serial
        constraint reservation_pk
            primary key,
    user_id      integer              not null
        constraint reservation_user_id_fk
            references "user",
    screening_id integer              not null
        constraint reservation_screening_id_fk
            references screening,
    seat_id      integer              not null
        constraint reservation_seat_id_fk
            references seat,
    active       boolean default true not null
);

alter table reservation
    owner to postgres;

create or replace view upcoming_screenings_view(screening_id, movie_id, room_id, start_date, title) as
SELECT s.id AS screening_id,
       m.id AS movie_id,
       r.id AS room_id,
       s.start_date,
       m.title
FROM kino.screening s
         JOIN kino.movie m ON s.movie_id = m.id
         JOIN kino.room r ON s.room_id = r.id
WHERE s.start_date > now();

alter table upcoming_screenings_view
    owner to postgres;

create or replace view user_stats_view(username, email, title, reserved_count) as
SELECT u.username,
       u.email,
       m.title,
       count(*) AS reserved_count
FROM kino.reservation r
         JOIN kino.screening s ON r.screening_id = s.id
         JOIN kino.movie m ON s.movie_id = m.id
         JOIN kino."user" u ON r.user_id = u.id
WHERE r.active = true
GROUP BY u.username, m.title, u.email;

alter table user_stats_view
    owner to postgres;

create or replace procedure public.insert_seats_json(IN room_id integer, IN data json)
    language plpgsql
as
$$
    declare item JSON;
begin
    for item in select * from json_array_elements(data)
        loop
            insert into kino.seat(id, room_id, dim_x, dim_y, row, number, seat_type)
            values(default, room_id, (item->>'x')::smallint, (item->>'y')::smallint, (item->>'y')::smallint + 1, (item->>'number')::smallint, (item->>'type')::integer);
        end loop;
end;
$$;

alter procedure public.insert_seats_json(integer, json) owner to postgres;

create or replace function public.validate_screening_overlap() returns trigger
    language plpgsql
as
$$
DECLARE
  new_end TIMESTAMP;
BEGIN

  SELECT NEW.start_date + (m.runtime * INTERVAL '1 minute')
  INTO new_end
  FROM kino.movie m
  WHERE m.id = NEW.movie_id;


  PERFORM 1
  FROM kino.screening s
  JOIN kino.movie m ON s.movie_id = m.id
  WHERE s.room_id = NEW.room_id
    AND NEW.start_date < (s.start_date + (m.runtime * INTERVAL '1 minute'))
    AND new_end > s.start_date;

  IF FOUND THEN
    RAISE EXCEPTION 'Screening overlaps with an existing screening in the same room' USING ERRCODE = 'P0010';
  END IF;

  RETURN NEW;
END;
$$;

alter function public.validate_screening_overlap() owner to postgres;
