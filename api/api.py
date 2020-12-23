from flask import Flask,request;
from flask_restful import Api,Resource;
from flask_cors import CORS;
import mysql.connector
from mysql.connector import cursor;

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="123456",
    database='project'
);

app = Flask(__name__);

CORS(app);

api = Api(app);


class Disease(Resource):
    def get(self):
        symptoms = request.args.get("symptoms");
        symptoms = symptoms.strip("[]").split(",");
        symptoms = ",".join(map(str,symptoms));
        print("disease are {}".format(symptoms));
        cursor = db.cursor();
        query = """
            select dName,count(*) as frequency from
            disease d,diseaseSymptoms ds,symptoms s
            where d.dId = ds.dId
            and ds.sId = s.sId
            and sName in (%s)
            group by dName
            order by frequency desc;
        """
        cursor.execute(query%(symptoms));
        record = cursor.fetchall();
        cursor.close();
        return record;

class Symptoms(Resource):
    def get(self):
        disease = request.args.get("disease");
        print("disease names are = %s"%(disease));
        query = """
            select sName
            from symptoms 
            where sId in (
	            select ds.sId
                from diseaseSymptoms ds,disease d
	            where ds.dId = d.dId
	            and dName = "%s"
            );
        """;
        cursor = db.cursor();
        cursor.execute(query%(disease));
        symptoms = cursor.fetchall();
        result =[]
        for i in symptoms:
            result.append(i[0]);
        return result;
        

api.add_resource(Disease,"/disease");
api.add_resource(Symptoms,"/symptoms")

if __name__ =="__main__":
    app.run(debug=True);
