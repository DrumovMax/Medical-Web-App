-- create table if not exists public.users
-- (
--     id           bigint not null,
--     mobile_phone varchar(255),
--     password     varchar(255),
--     rate         integer,
--     real_name    varchar(255),
--     role         varchar(255),
--     status       integer,
--     username     varchar(255),
--     constraint users_pkey primary key (id)
-- );
--
-- create table if not exists public.topics
-- (
--     id            bigint not null,
--     creation_time timestamp,
--     creator_id    bigint,
--     name          varchar(255),
--     constraint topics_pkey primary key (id)
-- );
--
-- alter table public.topics owner to postgres;
-- alter table public.users  owner to postgres;
--

insert into files(creation_time, size, initial_name)
values (current_timestamp, 200, 'file1.dcm');

insert into files(creation_time, size, initial_name)
values (current_timestamp, 344, 'file2.dcm');