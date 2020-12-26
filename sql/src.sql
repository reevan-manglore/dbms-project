create database if not exists project;

use project;


create table if not exists disease (
	dId integer PRIMARY KEY auto_increment ,
    dName varchar(40) not null,
    dType varchar(50)
);

create table if not exists symptoms (
	sId integer PRIMARY KEY auto_increment,
    sName varchar(40) not null
);

create table if not exists diseaseSymptoms (
	dId integer not null, 
    sId integer not null,
    sPart varchar(50) default "entry-missing",
    foreign key (dId) references disease(dId) on delete cascade,
    foreign key (sId) references symptoms(sId) on delete cascade,
    unique(dId,sId)
);

create table if not exists medicine (
	mId integer auto_increment, 
	mName varchar(40) not null,
    modeOfAdministration varchar(40) default "entry-missing",
    PRIMARY KEY (mId)
);

create table if not exists chemicals (
	cId integer auto_increment,
    cName varchar(40) not null,
    PRIMARY KEY (cId)
); 

create table if not exists medicineContents (
	mId integer not null,
	cId integer not null,
	foreign key (mId) references  medicine(mId) on delete cascade,
	foreign key (cId) references chemicals(cId) on delete cascade,
    unique(mId,cId)
);

create table if not exists treatment (
	dId integer not null,
    mId integer not null,
    foreign key (dId) references disease(dId) on delete cascade,
	foreign key (mId) references medicine(mId) on delete cascade,
    unique(dId,mId)
);

create table if not exists similarMedicine (
	mId integer not null,
    similar integer not null,
    foreign key (mId) references medicine(mId) on delete cascade,
    foreign key (similar) references medicine(mId) on delete cascade,
    unique(mId,similar)
);

create table if not exists temp(
	col1 varchar(50),
	col2 varchar(50)
);

-- start of sql insert statement and  insertion of dummy data --

insert into disease (dName,dType) values ("pneumonia","infectious");

insert into disease (dName,dType) values ("schizophrenia","mental");

insert into disease (dName,dType) values ("oral thrush","oral");

-- next insertion into symptoms table 

insert into symptoms (sName) values ("chest pain");

insert into symptoms (sName) values ("fever");

insert into symptoms (sName) values ("fatigue");

insert into symptoms (sName) values ("nausea");

insert into symptoms (sName) values ("chills");

insert into symptoms (sName) values ("memory loss");

insert into symptoms (sName) values ("hallucination");

insert into symptoms (sName) values ("depression");

insert into symptoms (sName) values ("anger");

insert into symptoms (sName) values ("white patches");

insert into symptoms (sName) values ("loss of taste");

insert into symptoms (sName) values ("cracks");

insert into symptoms (sName) values ("burning");

insert into symptoms (sName) values ("pain");


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

insert into medicine (mName,modeOfAdministration) values ("amoxicillin","oral");

insert into medicine (mName,modeOfAdministration) values ("wymox","oral");

insert into medicine (mName,modeOfAdministration) values ("mox","oral");

insert into medicine (mName,modeOfAdministration) values ("erox","oral");

insert into medicine (mName,modeOfAdministration) values ("cipmox","oral");

insert into medicine (mName,modeOfAdministration) values ("soltus","oral");

insert into medicine (mName,modeOfAdministration) values ("maxpride","oral");

insert into medicine (mName,modeOfAdministration) values ("silpitac","oral");

insert into medicine (mName,modeOfAdministration) values ("solian","oral");

insert into medicine (mName,modeOfAdministration) values ("af 150","oral");

insert into medicine (mName,modeOfAdministration) values ("flika","oral");

insert into medicine (mName,modeOfAdministration) values ("fluco","oral");

insert into medicine (mName,modeOfAdministration) values ("cone","oral");



-- next insertion into chemicals table

insert into chemicals (cName) values ("amoxicillin");

insert into chemicals (cName) values ("amisulpride");

insert into chemicals (cName) values ("fluconazole");


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
insert into similarMedicine values (1,1);

insert into similarMedicine values (1,2);

insert into similarMedicine values (1,3);

insert into similarMedicine values (1,4);

insert into similarMedicine values (1,5);

insert into similarMedicine values (6,6);

insert into similarMedicine values (6,7);

insert into similarMedicine values (6,8);

insert into similarMedicine values (6,9);

insert into similarMedicine values (10,10);

insert into similarMedicine values (10,11);

insert into similarMedicine values (10,12);

insert into similarMedicine values (10,13);


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
	where mId in ( select m.mId 
				  from medicine m,similarMedicine s 
                  where m.mId = s.similar
                  and m.mName = "amoxicillin"
				)
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


-- to get all results for auto completeion secondory queries 


-- to get all names of disease

select dName
from disease
where dName
like "p%";

-- to get all symptoms

select sName
from symptoms
where sName
like "f%";

-- to get all medicine names

select mName
from medicine
where mName
like "m%";

-- to get all chemical names
select cName
from chemicals
where cName
like "a%";


-- start of mysql procedure

DELIMITER //
create procedure  insertDisease(in name varchar(50),in type varchar(50))
BEGIN
	declare test integer default 0;
    declare lDid integer default 0; -- l prefix for local disease id
    declare lSid integer default 0; -- l prefix for local symptom id
    declare hasField integer default 0;
	declare finished integer default 0;
    declare col1 varchar(50) default "";
    declare col2 varchar(50) default "";
	declare itr cursor for select * from temp;
    declare continue handler for not found set finished = 1;
    select exists(select * from disease d where d.dName = name) into test;
    if test = 0 then
		insert into disease (dName,dType) values (name,type);
	end if;
    select dId from disease where dName = name into lDid;
    open itr;
    insertSymptoms: loop
		fetch itr into col1,col2;
        if finished = 1 then
			delete from temp;    
			leave insertSymptoms;
		end if;
        SET test = 0;
        set hasField = 0;
        select exists(select * from symptoms where sName = col1) into test;
        if test = 0 then
			insert into symptoms (sName) values (col1);
        end if;
        select sId from symptoms where sName = col1 into lSid;
        select exists(select * from diseaseSymptoms where dId = lDId and sId = lSid ) into hasField;
        if hasField = 0 then
            insert into diseaseSymptoms values (lDid,lSid,col2);
        end if;
    end loop insertSymptoms;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE insertMedicine(in diseaseName varchar(50)) -- throws error if disease name is not present in database
startFunc:BEGIN
    declare hasField integer default 0;
    declare MESSAGE_TEXT varchar(200);-- for throwing exception
	declare finished integer default 0;
    declare test integer default 0;
    declare lDId integer default 0;
    declare lMId integer default 0;
    declare firstDrug integer default 0;
    declare col1 varchar(50) default "";
    declare col2 varchar(50) default "";
    declare itr cursor for select * from temp;
    declare continue handler for not found set finished = 1;
    select exists(select * from disease d where d.dName = diseaseName) into test;
    if test = 0 then
		 delete from temp;
         signal SQLSTATE '45000';
         set MESSAGE_TEXT = "entry for disease is not found"; 
		 leave startFunc;
	end if;
    select dId  from disease d where d.dName = diseaseName into lDId;
    open itr;
    extractMedicine:loop
		 set test = 0;
         set hasField = 0;
         fetch itr into col1,col2;
         if finished = 1 then
			delete from temp;
			leave extractMedicine;
         end if;
         select exists(select * from medicine m where mName = col1) into test;
         if test = 0 then
			insert into medicine (mName,modeOfAdministration) values (col1,col2);
         end if;
		select mId from medicine where mName = col1 into lMId;
        if firstDrug = 0 then
			set firstDrug = lMId; -- in order to get first drug so we can add to similar medicines table in order to find relation based on first drug
        end if;
        select exists(select * from treatment where dId = lDId and mId = lMId ) into hasField ;
        if hasField = 0 then
            insert into treatment values (lDId,lMId);
        END if;
        SET hasField = 0;
        select exists(select * from similarMedicine where mId = firstDrug and similar =lMId ) into hasField;
        if hasField = 0 then
            insert into similarMedicine values(firstDrug,lMId);
        end if;
    end loop extractMedicine;
END//
DELIMITER ;




DELIMITER //
CREATE PROCEDURE insertChemical(in medicineName varchar(50))
	func:BEGIN
        declare hasField integer default 0;
		declare finished integer default 0;
        declare test integer default 0;
        declare MESSAGE_TEXT varchar(200);-- for throwing exception
        declare col1 varchar(50) default "";
		declare col2 varchar(50) default "";
        declare lMId integer default 0;
        declare lCId integer default 0;
        declare itr cursor for select * from temp;  -- either to change or to keep as it is
        declare continue handler for not found set finished = 1;
        select mId from medicine where mName = medicineName into lMId;
        if lMId = 0 then -- if medicine entry is not entered into database
           delete from temp;
           signal SQLSTATE '45000';
           set MESSAGE_TEXT = "entry for disease is not found"; 
		   leave func;
        end if;
        open itr;
        getChemical:loop
			set test = 0;
            set hasField = 0;
			fetch itr into col1,col2;
            if finished = 1 then
				delete from temp;
                leave getChemical;
            end if;
            select exists(select * from chemicals where cName = col1) into test;
            if test = 0 then
				insert into chemicals (cName) values (col1);
            end if;
            select cId from chemicals where cName = col1 into lCId;
            select exists(select * from medicineContents where mId = lMId and cId = lCId ) into hasField;
            if hasField = 0 then
                insert into medicineContents values (lMId,lCId);
            end if;
        end loop getChemical;
	END//
DELIMITER ;