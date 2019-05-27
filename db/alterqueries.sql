alter table Info 
add column password varchar(255) not null default 'password';

rename table Clients to Client;

alter table Invoice
add column description varchar(255);

alter table Factoring
change column `Clients_id` `Client_id` int(11);