create database if not exists project;

use project;


create table if not exists disease (
	dId integer PRIMARY KEY,
    dName varchar(40),
    dType varchar(50)
);

create table if not exists symptoms (
	sId integer PRIMARY KEY,
    sName varchar(40)
);

create table if not exists diseaseSymptoms (
	dId integer, 
    sId integer,
    sPart varchar(50),
    foreign key (dId) references disease(dId),
    foreign key (sId) references symptoms(sId)
);

create table if not exists medicine (
	mId integer, 
	mName varchar(40),
    modeOfAdministration varchar(40),
    PRIMARY KEY (mId)
);

create table if not exists chemicals (
	cId integer,
    cName varchar(40),
    PRIMARY KEY (cId)
);

create table if not exists medicineContents (
	mId integer,
	cId integer,
	foreign key (mId) references  medicine(mId),
	foreign key (cId) references chemicals(cId)
);

create table if not exists treatment (
	dId integer,
    mId integer,
    foreign key (dId) references disease(dId),
	foreign key (mId) references medicine(mId)
);

create table if not exists similarMedicine (
	mId integer,
    similar integer,
    foreign key (mId) references medicine(mId),
    foreign key (similar) references medicine(mId)
);

-- start of sql insert statement and  insertion of dummy data --

insert into disease values (1,"pneumonia","infectious");

insert into disease values (2,"schizophrenia","mental");

insert into disease values (3,"oral thrush","oral");

-- next insertion into symptoms table 

insert into symptoms values (1,"chest pain");

insert into symptoms values (2,"fever");

insert into symptoms values (3,"fatigue");

insert into symptoms values (4,"nausea");

insert into symptoms values (5,"chills");

insert into symptoms values (6,"memory loss");

insert into symptoms values (7,"hallucination");

insert into symptoms values (8,"depression");

insert into symptoms values (9,"anger");

insert into symptoms values (10,"white patches");

insert into symptoms values (11,"loss of taste");

insert into symptoms values (12,"cracks");

insert into symptoms values (13,"burning");

insert into symptoms values (14,"pain");


-- next insertion into diseaseSymptoms table

insert into diseaseSymptoms values (1,1,"chest");

insert into diseaseSymptoms values (1,2,"full body");

insert into diseaseSymptoms values (1,3,"full body");

insert into diseaseSymptoms values (1,4,"stomach");

insert into diseaseSymptoms (dId,sId) values (2,6);

insert into diseaseSymptoms (dId,sId) values (2,7);

insert into diseaseSymptoms (dId,sId) values (2,3);

insert into diseaseSymptoms (dId,sId) values (2,8);

insert into diseaseSymptoms (dId,sId) values (2,9);

insert into diseaseSymptoms values (3,10,"mouth");

insert into diseaseSymptoms values (3,11,null);

insert into diseaseSymptoms values (3,12,"mouth");

insert into diseaseSymptoms values (3,13,"mouth");

insert into diseaseSymptoms values (3,14,"mouth");

-- next insertion into medicine table

insert into medicine values (1,"amoxicillin","oral");

insert into medicine values (2,"wymox","oral");

insert into medicine values (3,"mox","oral");

insert into medicine values (4,"erox","oral");

insert into medicine values (5,"cipmox","oral");

insert into medicine values (6,"soltus","oral");

insert into medicine values (7,"maxpride","oral");

insert into medicine values (8,"silpitac","oral");

insert into medicine values (9,"solian","oral");

insert into medicine values (10,"af 150","oral");

insert into medicine values (11,"flika","oral");

insert into medicine values (12,"fluco","oral");

insert into medicine values (13,"cone","oral");



-- next insertion into chemicals table

insert into chemicals values (1,"amoxicillin");

insert into chemicals values (2,"amisulpride");

insert into chemicals values (3,"fluconazole");


-- next insertion into medicineContents table

insert into medicineContents values (1,1);

insert into medicineContents values (2,1);

insert into medicineContents values (3,1);

insert into medicineContents values (4,1);

insert into medicineContents values (5,1);

insert into medicineContents values (6,2);

insert into medicineContents values (7,2);

insert into medicineContents values (8,2);

insert into medicineContents values (9,2);

insert into medicineContents values (10,3);

insert into medicineContents values (11,3);

insert into medicineContents values (12,3);

insert into medicineContents values (13,3);


-- next insertion into treatment table

insert into treatment values (1,1);

insert into treatment values (1,2);

insert into treatment values (2,6);

insert into treatment values (2,8);

insert into treatment values (2,9);

insert into treatment values (3,10);

insert into treatment values (3,11);

insert into treatment values (3,12);

insert into treatment values (3,13);



-- next insertion into similarMedicine table

insert into similarMedicine values (1,2);

insert into similarMedicine values (1,3);

insert into similarMedicine values (1,4);

insert into similarMedicine values (1,5);

insert into similarMedicine values (2,1);

insert into similarMedicine values (2,3);

insert into similarMedicine values (2,4);

insert into similarMedicine values (2,5);

insert into similarMedicine values (3,1);

insert into similarMedicine values (3,2);

insert into similarMedicine values (3,4);

insert into similarMedicine values (3,5);

insert into similarMedicine values (6,7);

insert into similarMedicine values (6,9);

insert into similarMedicine values (7,8);

insert into similarMedicine values (7,9);

insert into similarMedicine values (10,11);

insert into similarMedicine values (10,12);

insert into similarMedicine values (10,13);

insert into similarMedicine values (11,10);

insert into similarMedicine values (11,12);

insert into similarMedicine values (11,13);

insert into similarMedicine values (12,10);

insert into similarMedicine values (12,11);

insert into similarMedicine values (12,13);

insert into similarMedicine values (13,10);

insert into similarMedicine values (13,11);

insert into similarMedicine values (13,12);


-- end of sql query insert statements  --





--  start of sql query for extracting data --

select dName,count(*) as frequency from
disease d,diseaseSymptoms ds,symptoms s
where d.dId = ds.dId
and ds.sId = s.sId
and sName in ("fatigue","depression")
group by dName
order by frequency desc;

select sName
from symptoms 
where sId in (
	select ds.sId
    from diseaseSymptoms ds,disease d
	where ds.dId = d.dId
	and dName = "schizophrenia"
);

select sName,sPart from
disease d,diseaseSymptoms ds,symptoms s
where d.dId = ds.dId
and ds.sId = s.sId
and dName = "pneumonia";

select mName,modeOfAdministration
from medicine
where mId in (
	select mId 
    from treatment t,disease d
    where d.dId = t.dId
    and dName = "schizophrenia"
);

select mName,modeOfAdministration
from medicine
where mId in(
	select similar
	from  similarMedicine
	where mId = ( select mId from medicine where mName = "amoxicillin") 
);

select cName
from chemicals
where cId in(
	select cId
	from medicineContents
	where mId = (select mId from medicine where mName = "amoxicillin")
);

select mName
from medicine m,chemicals c,medicineContents cc
where m.mId = cc.mId and c.cId = cc.cId 
and c.cName = "amisulpride";


 -- end of sql query for extracting data --