from typing import Type
from flask import Blueprint,request;
from flask_restful import Resource,Api
from flask_cors import CORS;
import mysql.connector;
from mysql.connector import cursor,errorcode;
 

post = Blueprint("posts.py",__name__);

CORS(post);

api = Api(post);


  
 
class AddDisease(Resource):
    def checkBody(self,body):
        if "disease" not in body or "symptoms" not in body:
            return False;
        if "name" not in body.get("disease") or "type" not in body.get("disease"):
            return False;
        if "names" not in body.get("symptoms") or  "parts" not in body.get("symptoms"):
            return False;
        if len(body.get("symptoms")["names"]) != len(body.get("symptoms")["parts"]):
            return False;
        return True;
    
    def genrateQuery(self,object,objName ,lst1 ,lst2):
        object = object.get(objName);
        insertQuery = "insert into temp (col1,col2) values ('{}','{}')";
        data = ",('{}','{}')";
        insertQuery = insertQuery.format(object[lst1][0],object[lst2][0]);
        for i in range(1,len(object[lst1])):
            insertQuery += data.format(object[lst1][i],object[lst2][i]);
        return insertQuery;
    
    def insertSymptoms(self,query):
        db = None;
        cursor = None; 
        try:
            db = mysql.connector.connect(
                host="localhost",
                user="root",
                password="123456",
                database='project'
            );
            cursor = db.cursor();
            cursor.execute(query);
            db.commit();
            cursor.close();
            db.close();
        except mysql.connector.Error as err:
            print(err.msg);
            if err.errno == 2002:
                return {"message":"there was error while trying to connect"},500
            if cursor != None:#close if cursor exists
                cursor.rollback();
                cursor.close();
            if db !=None:#close if db exists
                db.close();
            if err.errno ==  1062:
                return{"message":"there was duplicate entry in table"},400
            if err.errno ==  1064:
                return{"message":"there was error  in the syntax"},400
            if err.errno ==  1452:
                return{"message":"there was referential integrity error"},400
            else:
                return{"message":err.msg},400
        except Exception as e:
                print(e);
                if cursor != None:
                    cursor.rollback();
                    cursor.close();
                if db !=None:
                    db.close();
                return {"message":e},400
        return {"message":"success"},100

    def insertDisease(self,dName,dType):
        db = None;
        cursor = None;
        try:
            db = mysql.connector.connect(
                host="localhost",
                user="root",
                password="123456",
                database='project'
            );
            cursor = db.cursor();
            cursor.callproc('insertDisease',(dName,dType));
            db.commit();
            cursor.close();
            db.close();
        except mysql.connector.Error as err:
            print(err.msg);
            if cursor != None:
                cursor.rollback();
                cursor.close();
            if db !=None:
                db.close();
            return {"message":err.msg},400
        except Exception as e:
                print(e);
                if cursor != None:
                    cursor.rollback();
                    cursor.close();
                if db !=None:
                    db.close();
                return {"message":e},400
        return {"message":"success"},100

    def post(self):
        args = request.get_json();
        if self.checkBody(args) == False:
            return {"message":"some parameters are missing in the body"},400;
        query = self.genrateQuery(args,"symptoms","names","parts");
        message,err = self.insertSymptoms(query);
        if err != 100:#to check wether query is sucessfully executed or not
            return message,err;
        message,err = self.insertDisease(args.get("disease")["name"],args.get("disease")["type"]);
        if err!= 100:
            return message,err;
        return {"message":"success"},200


class AddMedicine(Resource):
    def checkBody(self,body):
        if "disease" not in body or "medicine" not in body or "chemicals" not in body:
            return False;
        if "name" not in body.get("disease"):
            return False;
        if "names" not in body.get("medicine") or  "types" not in body.get("medicine"):
            return False;
        if len(body.get("medicine")["names"]) != len(body.get("medicine")["types"]):
            return False;
        if len(body.get("chemicals")) !=  len(body.get("medicine")["names"]):
            return False;
        return True;

    def genrateQuery(self,object,objName ,lst1 ,lst2):
        object = object.get(objName);
        insertQuery = "insert into temp (col1,col2) values ('{}','{}')";
        data = ",('{}','{}')";
        insertQuery = insertQuery.format(object[lst1][0],object[lst2][0]);
        for i in range(1,len(object[lst1])):
            insertQuery += data.format(object[lst1][i],object[lst2][i]);
        return insertQuery;

    def insertMedicine(self,query):
        db = None;
        cursor = None; 
        try:
            db = mysql.connector.connect(
                host="localhost",
                user="root",
                password="123456",
                database='project'
            );
            cursor = db.cursor();
            cursor.execute(query);
            db.commit();
            cursor.close();
            db.close();
        except mysql.connector.Error as err:
            print(err.msg);
            if err.errno == 2002:
                return {"message":"there was error while trying to connect"},500
            if cursor != None:#close if cursor exists
                cursor.rollback();
                cursor.close();
            if db !=None:#close if db exists
                db.close();
            if err.errno ==  1062:
                return{"message":"there was duplicate entry in table"},400
            if err.errno ==  1064:
                return{"message":"there was error  in the syntax"},400
            if err.errno ==  1452:
                return{"message":"there was referential integrity error"},400
            else:
                return{"message":err.msg},400
        except Exception as e:
                print(e);
                if cursor != None:
                    cursor.rollback();
                    cursor.close();
                if db !=None:
                    db.close();
 
                return {"message":e},500

        return {"message":"success"},100

    def insertTreatement(self,dName):
        db = None;
        cursor = None;
        try:
            db = mysql.connector.connect(
                host="localhost",
                user="root",
                password="123456",
                database='project'
            );
            cursor = db.cursor();
            cursor.callproc('insertMedicine',[dName]);
            db.commit();
            cursor.close();
            db.close();
        except mysql.connector.Error as err:
            print(err);
            if cursor != None:
                db.rollback();
                cursor.close();
            if db !=None:
                db.close();
            if err.errno == 1644:
                return{"message":"disease does not exists in table"},400;
            return {"message":err.msg},400
        except Exception as e:
             print(e);
             if cursor != None:
                db.rollback();
                cursor.close();
             if db !=None:
                db.close();
 
             return {"message":e},500
 
              
 
        return {"message":"success"},100

    def getChemicalQuery(self,arg):
        isFirst = True
        insertQuery = "insert into temp (col1) values ('{}')";
        data = ",('{}')";
        if type(arg) == list:
            insertQuery = insertQuery.format(arg[0]);
            for i in arg[1:]:
                insertQuery += data.format(i);
        else:
            insertQuery = insertQuery.format(arg);
        return insertQuery;
         
    def insertChemical(self,mName,chemicalList):  
        for i in range(0,len(mName)):
            query = self.getChemicalQuery(chemicalList[i]);
            db = None;
            cursor = None; 
            try:
                db = mysql.connector.connect(
                    host="localhost",
                    user="root",
                    password="123456",
                    database='project'
                );
                cursor = db.cursor();
                cursor.execute(query);
                db.commit();
                cursor.close();
                db.close();
            except mysql.connector.Error as err:
                print(err.msg);
                if err.errno == 2002:
                    return {"message":"there was error while trying to connect"},500
                if cursor != None:#close if cursor exists
                    cursor.rollback();
                    cursor.close();
                if db !=None:#close if db exists
                    db.close();
                if err.errno ==  1062:
                    return{"message":"there was duplicate entry in table"},400
                if err.errno ==  1064:
                    return{"message":"there was error  in the syntax"},400
                if err.errno ==  1452:
                    return{"message":"there was referential integrity error"},400
                else:
                    return{"message":err.msg},400
            except Exception as e:
                print(e);
                if cursor != None:
                    cursor.rollback();
                    cursor.close();
                if db !=None:
                    db.close();
 
                return {"message":e},500
 
                
 
            db = None;#start of new query
            cursor = None;
            try:
                db = mysql.connector.connect(
                    host="localhost",
                    user="root",
                    password="123456",
                    database='project'
                );
                cursor = db.cursor();
                cursor.callproc('insertChemical',[mName[i]]);
                db.commit();
                cursor.close();
                db.close();
            except mysql.connector.Error as err:
                if cursor != None:
                    cursor.rollback();
                    cursor.close();
                if db !=None:
                    db.close();
                if err.errno == 1644:
                    return{"message":"medicine does not exists in table"},400;
                return {"message":err.msg},400
            except Exception as e:
                if cursor != None:
                    cursor.rollback();
                    cursor.close();
                if db !=None:
                    db.close();
 
                return {"message":e},500
 
                 
 
        return {"message":"success"},100;
    
    def post(self):
        args = request.get_json();
        
        if self.checkBody(args) == False:
            return {"message":"there is an error in the body of post request"},400;
        query  = self.genrateQuery(args,"medicine","names","types");
        msg,err = self.insertMedicine(query); 
        if err != 100:
            return msg,err;
        msg,err = self.insertTreatement(args.get("disease")["name"]);
        if err != 100:
            return msg,err;
        msg,err = self.insertChemical(args.get("medicine")["names"],args.get("chemicals"));
        if err !=100:
            return msg,err;
        return {"message":"success"},200;
        



api.add_resource(AddDisease,"/add-disease/");
api.add_resource(AddMedicine,"/add-medicine/")