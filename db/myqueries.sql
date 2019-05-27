use factoringdbv3;

#Participantes
insert into Info (company, email, tel) values ('Telefonica', 'telefonica@email.com', '222-2222');
insert into Client (Info_id) values (1);
insert into Info (company, email, tel) values ('Proveedores de Servicios', 'provees@email.com', '233-3333');
insert into Provider (Info_id) values (2);
insert into Info (company, email, tel) values ('Smart Investors', 'smartinv@email.com', '211-2111');
insert into Investor (Info_id) values (3);


select * from Info;
select * from Client;
select * from Provider;
select * from Investor;
# Select company, email and pasword from Client
select Client.id as client_id, Info.company as company, Info.email as email, Info.password as password
from Client
inner join Info on Client.Info_id = Info.id;

# Select company, email and pasword from Provider
select Provider.id as client_id, Info.company as company, Info.email as email, Info.password as password
from Provider
inner join Info on Provider.Info_id = Info.id;

# Select company, email and pasword from Investor
select Investor.id as client_id, Info.company as company, Info.email as email, Info.password as password
from Investor
inner join Info on Investor.Info_id = Info.id;

#-------------------- Invoice queries -----------------------------
insert into Invoice (emissionId, amount, description, emissionDate, expirationDate, factoringAmount, minInversion,roi)
values (10001, 50000, "General Services", "2019-5-25", "2019-7-25", 37000, 500, 0.1);

insert into Factoring (Client_id, Provider_id, Invoice_id) values (1, 1, 1);

select * from Invoice;

# Selecting the debtor and the owner companies
select Client.id as debtor_id, Infoc.company as debtor_company,
 Provider.id as owner_id, Infop.company as owner_company, 
 Invoice.emissionId
from Factoring 
inner join Client on Factoring.Client_id = Client.id
inner join Info as Infoc on Client.Info_id = Infoc.id
inner join Provider on Factoring.Provider_id = Provider.id 
inner join Info as Infop on Provider.Info_id = Infop.id
inner join Invoice on Invoice.id = Factoring.Invoice_id

#--------------- Inversion queries ------------------------
insert into Inversion (Investor_id, Factoring_id, amount) values (1, 1, 1000);

select Investor.id as investor_id, Infoi.company as investor_company, 
Inversion.amount as inversion,
Invoice.id as invoice_id, Invoice.roi as roi,
Infoc.company as debtor, Infop.company as owner
from Inversion
inner join Investor on Inversion.Investor_id = Investor.id
inner join Info as Infoi on Investor.Info_id = Infoi.id
inner join Factoring on Inversion.Factoring_id = Factoring.id
inner join Client on Factoring.Client_id = Client.id
inner join Info as Infoc on Client.Info_id = Infoc.id
inner join Provider on Factoring.Provider_id = Provider.id
inner join Info as Infop on Provider.Info_id = Infop.id
inner join Invoice on Factoring.Invoice_id = Invoice.id



